"use server";

import { KickaRating, rate } from "@kicka/lib/skill";
import { Solo, solo, soloMatches, users } from "@kicka/lib/db/schema";
import { and, desc, eq, ilike, ne, or } from "drizzle-orm";

import { MAX_SCORE } from "@kicka/lib/constants";
import { action } from "@kicka/lib/safe-action";
import { db } from "@kicka/lib/db";
import { getSession } from "@kicka/actions/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getAllUsers() {
  return await db.query.users.findMany();
}

export async function getAllOtherUsers() {
  const { user } = await getSession();
  return await db.query.users.findMany({
    where: ne(users.id, user.id),
  });
}

export async function getUserByName(name: string) {
  return await db.query.users.findMany({
    where: ilike(users.username, `${name}%`),
  });
}

export async function getUserByEmail(email: string) {
  return await db.query.users.findMany({
    where: ilike(users.email, `${email}%`),
  });
}

const draftSoloGameSchema = z.object({
  opponent: z.string(),
  myScore: z.number().int().min(0).max(MAX_SCORE),
  opponentScore: z.number().int().min(0).max(MAX_SCORE),
});

export const draftSoloGame = action(draftSoloGameSchema, async (args) => {
  try {
    const { user } = await getSession();
    const player1 = await db.query.solo.findFirst({
      where: eq(solo.user, user.id),
    });

    const player2 = await db.query.solo.findFirst({
      where: eq(solo.user, args.opponent),
    });

    if (!player2 || !player1) throw new Error("Opponent not found");

    if (player1.user === player2.user)
      throw new Error("You can't play with yourself");

    if (args.myScore === args.opponentScore)
      throw new Error("Draws are not allowed");

    await db.insert(soloMatches).values({
      player0: user.id,
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
  const { user } = await getSession();

  return await db.query.soloMatches.findMany({
    where: or(
      eq(soloMatches.player1, user.id),
      eq(soloMatches.player0, user.id),
    ),
    columns: {
      id: true,
      date: true,
      score0: true,
      score1: true,
      draft: true,
      mu0Change: true,
      mu1Change: true,
    },
    orderBy: [soloMatches.date],
    with: { player0: true, player1: true },
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

    if (!match) throw new Error("Match not found");

    if (
      !args.accept &&
      (session.user.id === match.player0.id ||
        session.user.id === match.player1.id)
    ) {
      await db.delete(soloMatches).where(eq(soloMatches.id, args.id));
      return { ok: true };
    }

    if (match.player1.id !== session.user.id)
      throw new Error("You are not the opponent");

    const [player0, player1] = await Promise.all([
      db.query.solo.findFirst({
        where: eq(solo.user, match.player0.id),
      }),

      db.query.solo.findFirst({
        where: eq(solo.user, match.player1.id),
      }),
    ]);

    if (!player0 || !player1) throw new Error("FATAL ERROR: Player not found");

    const winner = match.score0 > match.score1 ? player0 : player1;
    const loser = match.score0 > match.score1 ? player1 : player0;

    await updateSoloGameRating({ matchId: match.id, winner, loser });

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

const updateSoloGameRating = async (args: {
  matchId: string;
  winner: Solo;
  loser: Solo;
}) => {
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

    await tx
      .update(solo)
      .set({
        skill_mu: newWinnerRating.mu,
        skill_sigma: newWinnerRating.sigma,
        wins: args.winner.wins + 1,
        games: args.winner.games + 1,
      })
      .where(eq(solo.user, args.winner.user));
    await tx
      .update(solo)
      .set({
        skill_mu: newLoserRating.mu,
        skill_sigma: newLoserRating.sigma,
        games: args.loser.games + 1,
      })
      .where(eq(solo.user, args.loser.user));
    await tx.update(soloMatches).set({
      draft: false,
      mu0Change: newWinnerRating.mu - args.winner.skill_mu,
      mu1Change: newLoserRating.mu - args.loser.skill_mu,
    });
  });
};

export type SoloRankingEntry = Awaited<
  ReturnType<typeof getSoloRanking>
>[number];

export const getSoloRanking = async (cursor: number, pageLength = 20) => {
  return await db.query.solo.findMany({
    columns: {
      skill_mu: true,
      games: true,
      wins: true,
    },
    with: {
      user: true,
    },
    offset: cursor,
    limit: pageLength,
    orderBy: [desc(solo.skill_mu)],
  });
};
