"use server";

import { KickaRating, rate } from "@kicka/lib/skill";
import { Solo, solo, soloMatches, users } from "@kicka/db/schema";
import { and, eq, ilike, ne, or } from "drizzle-orm";

import { MAX_SCORE } from "@kicka/lib/constants";
import { action } from "@kicka/lib/safe-action";
import { db } from "@kicka/db";
import { getSession } from "@kicka/lib/get-session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function deleteUser() {
  const session = await getSession();
  await db.delete(users).where(eq(users.email, session.user?.email!));
}

export async function getAllUsers() {
  return await db.query.users.findMany();
}

export async function getAllOtherUsers() {
  const session = await getSession();

  return await db.query.users.findMany({
    where: ne(users.email, session.user.email),
  });
}

export async function getUserByName(name: string) {
  return await db.query.users.findMany({
    where: ilike(users.name, `${name}%`),
  });
}

export async function getUserByEmail(email: string) {
  return await db.query.users.findMany({
    where: ilike(users.email, `${email}%`),
  });
}

const draftSoloGameSchema = z.object({
  opponent: z.string().email(),
  myScore: z.number().int().min(0).max(MAX_SCORE),
  opponentScore: z.number().int().min(0).max(MAX_SCORE),
});

export const draftSoloGame = action(draftSoloGameSchema, async (args) => {
  try {
    const session = await getSession();
    const player1 = await db.query.solo.findFirst({
      where: eq(solo.user, session.user.email),
    });

    const player2 = await db.query.solo.findFirst({
      where: eq(solo.user, args.opponent),
    });

    if (!player2 || !player1)
      return { ok: false, message: "Opponent not found" };

    if (args.myScore === args.opponentScore)
      return { ok: false, message: "Draws not allowed" };

    await db.insert(soloMatches).values({
      player0: session.user.email,
      player1: args.opponent,
      score0: args.myScore,
      score1: args.opponentScore,
    });

    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "An error occurred" };
  }
});

export async function getSolo(user: string) {
  const games = await db.query.solo.findFirst({
    where: eq(solo.user, user),
  });

  return games;
}

export type GetSoloMatch = Awaited<ReturnType<typeof getSoloMatches>>[number];

export async function getSoloMatches() {
  const session = await getSession();

  return await db.query.soloMatches.findMany({
    where: or(
      eq(soloMatches.player1, session.user.email),
      eq(soloMatches.player0, session.user.email),
    ),
    columns: {
      id: true,
      date: true,
      score0: true,
      score1: true,
      draft: true,
    },
    orderBy: [soloMatches.date],
    with: { player0: true },
  });
}

const acceptSoloGameSchema = z.object({
  accept: z.boolean(),
  id: z.string(),
});

export const acceptSoloGame = action(acceptSoloGameSchema, async (args) => {
  try {
    const session = await getSession();
    const match = await db.query.soloMatches.findFirst({
      where: eq(soloMatches.id, args.id),
      with: {
        player0: true,
        player1: true,
      },
    });

    if (!match) return new Error("Match not found");

    if (
      !args.accept &&
      (session.user.email === match.player0.email ||
        session.user.email === match.player1.email)
    ) {
      await db.delete(soloMatches).where(eq(soloMatches.id, args.id));
      return { ok: true };
    }

    if (match.player1.email !== session.user.email)
      return { ok: false, message: "You are not the opponent" };

    const [_, player0, player1] = await Promise.all([
      db
        .update(soloMatches)
        .set({
          draft: false,
        })
        .where(eq(soloMatches.id, args.id)),

      db.query.solo.findFirst({
        where: eq(solo.user, match.player0.email),
      }),

      db.query.solo.findFirst({
        where: eq(solo.user, match.player1.email),
      }),
    ]);

    if (!player0 || !player1) return new Error("FATAL ERROR: Player not found");

    const winner = match.score0 > match.score1 ? player0 : player1;
    const loser = match.score0 > match.score1 ? player1 : player0;

    await updateSoloGameRating({ winner, loser });

    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    await db.delete(soloMatches).where(eq(soloMatches.id, args.id));
    revalidatePath("/");
    if (error instanceof Error) {
      console.error(error.message);
      return { ok: false, message: error.message + "... deleting draft" };
    }
    return { ok: false, message: "An error occurred... deleting draft" };
  }
});

const updateSoloGameRating = async (args: { winner: Solo; loser: Solo }) => {
  await db.transaction(async (tx) => {
    const winnerRating = new KickaRating(
      args.winner.skill_mu,
      args.winner.skill_sigma,
    );
    const loserRating = new KickaRating(
      args.loser.skill_mu,
      args.loser.skill_sigma,
    );
    const { newWinnerRating, newLoserRating } = rate({
      winnerRating,
      loserRating,
    });

    await Promise.all([
      tx
        .update(solo)
        .set({
          skill_mu: newWinnerRating.mu,
          skill_sigma: newWinnerRating.sigma,
          wins: args.winner.wins + 1,
          games: args.winner.games + 1,
        })
        .where(eq(solo.user, args.winner.user)),
      tx
        .update(solo)
        .set({
          skill_mu: newLoserRating.mu,
          skill_sigma: newLoserRating.sigma,
          games: args.loser.games + 1,
        })
        .where(eq(solo.user, args.loser.user)),
    ]);
  });
};
