"use server";

import { KickaRating, initialDuoRating, rate } from "@kicka/lib/skill";
import {
  duo,
  duoMatches,
  solo,
  soloMatches,
  users,
} from "@kicka/lib/db/schema";
import { and, desc, eq, ilike, ne, or } from "drizzle-orm";

import { MAX_SCORE } from "@kicka/lib/constants";
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

const draftDuoGameSchema = z.object({
  teamName: z.string(),
  partner: z.string(),
  opponent1: z.string(),
  opponent2: z.string(),
  myScore: z.number().int().min(0).max(MAX_SCORE),
  opponentScore: z.number().int().min(0).max(MAX_SCORE),
});

type DraftDuoGameArgs = z.infer<typeof draftDuoGameSchema>;

export async function draftDuoGame(args: DraftDuoGameArgs) {
  try {
    draftDuoGameSchema.parse(args);
    const { user } = await getSession();

    let [myPlayer0, myPlayer1, opponentPlayer0, opponentPlayer1] =
      await Promise.all([
        await db.query.users.findFirst({
          where: eq(users.id, user.id),
        }),

        await db.query.users.findFirst({
          where: eq(users.id, args.partner),
        }),

        await db.query.users.findFirst({
          where: eq(users.id, args.opponent1),
        }),

        await db.query.users.findFirst({
          where: eq(users.id, args.opponent2),
        }),
      ]);

    if (!myPlayer0 || !myPlayer1 || !opponentPlayer0 || !opponentPlayer1)
      throw new Error("Players not found");

    if (
      myPlayer0.id === myPlayer1.id ||
      myPlayer0.id === opponentPlayer0.id ||
      myPlayer0.id === opponentPlayer1.id ||
      myPlayer1.id === opponentPlayer0.id ||
      myPlayer1.id === opponentPlayer1.id ||
      opponentPlayer0.id === opponentPlayer1.id
    )
      throw new Error("Players can't be the same");

    if (args.myScore === args.opponentScore)
      throw new Error("Draws are not allowed");

    myPlayer0 = myPlayer0.id < myPlayer1.id ? myPlayer0 : myPlayer1;
    myPlayer1 = myPlayer0.id < myPlayer1.id ? myPlayer1 : myPlayer0;

    opponentPlayer0 =
      opponentPlayer0.id < opponentPlayer1.id
        ? opponentPlayer0
        : opponentPlayer1;

    opponentPlayer1 =
      opponentPlayer0.id < opponentPlayer1.id
        ? opponentPlayer1
        : opponentPlayer0;

    const team0 = await db.query.duo.findFirst({
      where: and(eq(duo.user0, myPlayer0.id), eq(duo.user1, myPlayer1.id)),
    });

    const team1 = await db.query.duo.findFirst({
      where: and(
        eq(duo.user0, opponentPlayer0.id),
        eq(duo.user1, opponentPlayer1.id),
      ),
    });

    const initial = initialDuoRating();

    if (!team0) {
      await db.insert(duo).values({
        name: args.teamName,
        user0: myPlayer0.id,
        user1: myPlayer1.id,
        skillMu: initial.mu,
        skillSigma: initial.sigma,
      });
    }

    if (!team1) {
      await db.insert(duo).values({
        name: opponentPlayer0.id + " + " + opponentPlayer1.id,
        user0: opponentPlayer0.id,
        user1: opponentPlayer1.id,
        skillMu: initial.mu,
        skillSigma: initial.sigma,
      });
    }

    const match = await db
      .insert(duoMatches)
      .values({
        player0: myPlayer0.id,
        player1: myPlayer1.id,
        player2: opponentPlayer0.id,
        player3: opponentPlayer1.id,
        score0: args.myScore,
        score1: args.opponentScore,
      })
      .returning();

    acceptDuoGame({ accept: true, id: match[0].id });
    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "An error occurred" };
  }
}

const draftSoloGameSchema = z.object({
  opponent: z.string(),
  myScore: z.number().int().min(0).max(MAX_SCORE),
  opponentScore: z.number().int().min(0).max(MAX_SCORE),
});

type DraftSoloGameArgs = z.infer<typeof draftSoloGameSchema>;

export async function draftSoloGame(args: DraftSoloGameArgs) {
  try {
    draftSoloGameSchema.parse(args);
    const { user } = await getSession();
    const player0 = await db.query.solo.findFirst({
      where: eq(solo.user, user.id),
    });

    const player1 = await db.query.solo.findFirst({
      where: eq(solo.user, args.opponent),
    });

    if (!player1 || !player0) throw new Error("Opponent not found");

    if (player0.user === player1.user)
      throw new Error("You can't play with yourself");

    if (args.myScore === args.opponentScore)
      throw new Error("Draws are not allowed");

    const match = await db
      .insert(soloMatches)
      .values({
        player0: player0.user,
        player1: player1.user,
        score0: args.myScore,
        score1: args.opponentScore,
      })
      .returning();

    acceptSoloGame({ accept: true, id: match[0].id });

    return { ok: true };
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { ok: false, message: error.message };
    }
    return { ok: false, message: "An error occurred" };
  }
}

export async function getSolo(user: string) {
  const games = await db.query.solo.findFirst({
    where: eq(solo.user, user),
  });

  return games;
}

export type SoloRankingEntry = Awaited<
  ReturnType<typeof getSoloRanking>
>[number];

export const getSoloRanking = async (cursor: number, pageLength = 20) => {
  return await db.query.solo.findMany({
    columns: {
      skillMu: true,
      games: true,
      wins: true,
    },
    with: {
      user: true,
    },
    offset: cursor,
    limit: pageLength,
    orderBy: [desc(solo.skillMu)],
  });
};

export type GetSoloMatch = Awaited<ReturnType<typeof getSoloMatches>>[number];

export async function getSoloMatches(cursor: number, pageLength = 10) {
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
    orderBy: [desc(soloMatches.date)],
    with: { player0: true, player1: true },
    offset: cursor,
    limit: pageLength,
  });
}

const acceptSoloGameSchema = z.object({
  accept: z.boolean(),
  id: z.string(),
});

type AcceptSoloGameArgs = z.infer<typeof acceptSoloGameSchema>;

export async function acceptSoloGame(args: AcceptSoloGameArgs) {
  try {
    acceptSoloGameSchema.parse(args);
    const session = await getSession();

    const match = await db.query.soloMatches.findFirst({
      where: eq(soloMatches.id, args.id),
    });

    if (!match) throw new Error("Match not found");

    if (
      !args.accept &&
      (session.user.id === match.player0 || session.user.id === match.player1)
    ) {
      await db.delete(soloMatches).where(eq(soloMatches.id, args.id));
      return { ok: true };
    }

    if (session.user.id === match.player0) {
      await db
        .update(soloMatches)
        .set({ accept0: args.accept })
        .where(eq(soloMatches.id, args.id));
    }

    if (session.user.id === match.player1) {
      await db
        .update(soloMatches)
        .set({ accept1: args.accept })
        .where(eq(soloMatches.id, args.id));
    }

    await updateSoloGameRating(args.id);
    revalidatePath("/");
  } catch (error) {
    await db.delete(duoMatches).where(eq(duoMatches.id, args.id));
    revalidatePath("/");
    if (error instanceof Error) {
      console.error(error.message);
      return { ok: false, message: error.message + "... deleting draft" };
    }
    return { ok: false, message: "An error occurred... deleting draft" };
  }
}

async function updateSoloGameRating(id: string) {
  const match = await db.query.soloMatches.findFirst({
    where: eq(soloMatches.id, id),
  });

  if (!match || !match.draft) return;

  if (!match.accept0 || !match.accept1) return;

  await db.transaction(async (tx) => {
    const player0 = await db.query.solo.findFirst({
      where: eq(solo.user, match.player0),
    });

    const player1 = await db.query.solo.findFirst({
      where: eq(solo.user, match.player1),
    });

    if (!player0 || !player1) return;

    const winner = match.score0 > match.score1 ? player0 : player1;
    const loser = match.score0 > match.score1 ? player1 : player0;

    const winnerRating = new KickaRating(winner.skillMu, winner.skillSigma);
    const loserRating = new KickaRating(loser.skillMu, loser.skillSigma);

    const { newWinnerRating, newLoserRating } = rate({
      winnerRating,
      loserRating,
    });

    await tx
      .update(solo)
      .set({
        skillMu: newWinnerRating.mu,
        skillSigma: newWinnerRating.sigma,
        wins: winner.wins + 1,
        games: winner.games + 1,
      })
      .where(eq(solo.user, winner.user));
    await tx
      .update(solo)
      .set({
        skillMu: newLoserRating.mu,
        skillSigma: newLoserRating.sigma,
        games: loser.games + 1,
      })
      .where(eq(solo.user, loser.user));
    await tx.update(soloMatches).set({
      draft: false,
      mu0Change: newWinnerRating.mu - winner.skillMu,
      mu1Change: newLoserRating.mu - loser.skillMu,
    });
  });
}

const acceptDuoGameSchema = z.object({
  accept: z.boolean(),
  id: z.string(),
});

type AcceptDuoGameArgs = z.infer<typeof acceptDuoGameSchema>;

export async function acceptDuoGame(args: AcceptDuoGameArgs) {
  try {
    acceptDuoGameSchema.parse(args);
    const session = await getSession();
    const match = await db.query.duoMatches.findFirst({
      where: eq(soloMatches.id, args.id),
    });

    if (!match) throw new Error("Match not found");

    if (
      !args.accept &&
      (session.user.id === match.player0 ||
        session.user.id === match.player1 ||
        session.user.id === match.player2 ||
        session.user.id === match.player3)
    ) {
      await db.delete(duoMatches).where(eq(duoMatches.id, args.id));
      return { ok: true };
    }

    if (session.user.id === match.player0) {
      await db
        .update(duoMatches)
        .set({ accept0: args.accept })
        .where(eq(duoMatches.id, args.id));
    }
    if (session.user.id === match.player1) {
      await db
        .update(duoMatches)
        .set({ accept1: args.accept })
        .where(eq(duoMatches.id, args.id));
    }
    if (session.user.id === match.player2) {
      await db
        .update(duoMatches)
        .set({ accept2: args.accept })
        .where(eq(duoMatches.id, args.id));
    }
    if (session.user.id === match.player3) {
      await db
        .update(duoMatches)
        .set({ accept3: args.accept })
        .where(eq(duoMatches.id, args.id));
    }

    await updateDuoGameRating(args.id);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    await db.delete(duoMatches).where(eq(duoMatches.id, args.id));
    revalidatePath("/");
    if (error instanceof Error) {
      console.error(error.message);
      return { ok: false, message: error.message + "... deleting draft" };
    }
    return { ok: false, message: "An error occurred... deleting draft" };
  }
}

async function updateDuoGameRating(id: string) {
  const match = await db.query.duoMatches.findFirst({
    where: eq(duoMatches.id, id),
  });

  if (!match || !match.draft) return;

  if (!match.accept0 || !match.accept1 || !match.accept2 || !match.accept3)
    return;

  await db.transaction(async (tx) => {
    const team0 = await db.query.duo.findFirst({
      where: and(eq(duo.user0, match.player0), eq(duo.user1, match.player1)),
    });

    const team1 = await db.query.duo.findFirst({
      where: and(eq(duo.user0, match.player2), eq(duo.user1, match.player3)),
    });

    if (!team0 || !team1) return;

    const winnerTeam = match.score0 > match.score1 ? team0 : team1;
    const loserTeam = match.score0 > match.score1 ? team1 : team0;

    const winnerRating = new KickaRating(
      winnerTeam.skillMu,
      winnerTeam.skillSigma,
    );
    const loserRating = new KickaRating(
      loserTeam.skillMu,
      loserTeam.skillSigma,
    );
    const { newWinnerRating, newLoserRating } = rate({
      winnerRating,
      loserRating,
    });

    await tx
      .update(duo)
      .set({
        skillMu: newWinnerRating.mu,
        skillSigma: newWinnerRating.sigma,
        wins: winnerTeam.wins + 1,
        games: winnerTeam.games + 1,
      })
      .where(
        and(eq(duo.user0, winnerTeam.user0), eq(duo.user1, winnerTeam.user1)),
      );
    await tx
      .update(duo)
      .set({
        skillMu: newLoserRating.mu,
        skillSigma: newLoserRating.sigma,
        games: loserTeam.games + 1,
      })
      .where(
        and(eq(duo.user0, loserTeam.user0), eq(duo.user1, loserTeam.user1)),
      );
    await tx.update(duoMatches).set({
      draft: false,
      mu0Change: newWinnerRating.mu - winnerTeam.skillMu,
      mu1Change: newLoserRating.mu - loserTeam.skillMu,
    });
  });
}
