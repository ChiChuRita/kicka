"use server";

import { SoloRater, DuoRater, TeamRater } from "@kicka/lib/skill";
import {
  duo,
  duoMatches,
  solo,
  soloMatches,
  users,
} from "@kicka/lib/db/schema";

import { and, desc, eq, ilike, ne, or, inArray } from "drizzle-orm";

import { MAX_SCORE } from "@kicka/lib/constants";
import { db } from "@kicka/lib/db";
import { getSession } from "@kicka/actions/auth";
import { z } from "zod";

export async function getSoloMatch(matchID: string) {
  return db.query.soloMatches.findFirst({
    where: eq(soloMatches.id, matchID),
  });
}

export async function getDuoMatch(matchID: string) {
  return db.query.duoMatches.findFirst({
    where: eq(duoMatches.id, matchID),
  });
}

export async function getOwnTeamName(user1?: string) {
  const { user } = await getSession();
  const user0 = user.id;

  if (!user0 || !user1) return "";

  const sortedUser0 = user0 < user1 ? user0 : user1;
  const sortedUser1 = user0 < user1 ? user1 : user0;

  const team = await db.query.duo.findFirst({
    columns: {
      name: true,
    },
    where: and(eq(duo.user0, sortedUser0), eq(duo.user1, sortedUser1)),
  });

  return team ? team.name : "";
}

export async function getTeamName(user0?: string, user1?: string) {
  if (!user0 || !user1) return "";

  const sortedUser0 = user0 < user1 ? user0 : user1;
  const sortedUser1 = user0 < user1 ? user1 : user0;

  const team = await db.query.duo.findFirst({
    columns: {
      name: true,
    },
    where: and(eq(duo.user0, sortedUser0), eq(duo.user1, sortedUser1)),
  });

  return team ? team.name : "";
}

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
        db.query.users.findFirst({
          where: eq(users.id, user.id),
        }),

        db.query.users.findFirst({
          where: eq(users.id, args.partner),
        }),

        db.query.users.findFirst({
          where: eq(users.id, args.opponent1),
        }),

        db.query.users.findFirst({
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

    const sortedMyPlayer0 = myPlayer0.id < myPlayer1.id ? myPlayer0 : myPlayer1;
    const sortedMyPlayer1 = myPlayer0.id < myPlayer1.id ? myPlayer1 : myPlayer0;

    const sortedOpponentPlayer0 =
      opponentPlayer0.id < opponentPlayer1.id
        ? opponentPlayer0
        : opponentPlayer1;

    const sortedOpponentPlayer1 =
      opponentPlayer0.id < opponentPlayer1.id
        ? opponentPlayer1
        : opponentPlayer0;

    const team0 = await db.query.duo.findFirst({
      where: and(
        eq(duo.user0, sortedMyPlayer0.id),
        eq(duo.user1, sortedMyPlayer1.id),
      ),
    });

    const team1 = await db.query.duo.findFirst({
      where: and(
        eq(duo.user0, sortedOpponentPlayer0.id),
        eq(duo.user1, sortedOpponentPlayer1.id),
      ),
    });

    const initial = TeamRater.create();

    if (!team0) {
      await db.insert(duo).values({
        name: args.teamName,
        user0: sortedMyPlayer0.id,
        user1: sortedMyPlayer1.id,
        skillMu: initial.mu,
        skillSigma: initial.sigma,
        rating: TeamRater.expose(initial),
        lastGameAt: new Date(),
      });
    } else {
      await db
        .update(duo)
        .set({
          name: args.teamName,
          lastGameAt: new Date(),
        })
        .where(
          and(
            eq(duo.user0, sortedMyPlayer0.id),
            eq(duo.user1, sortedMyPlayer1.id),
          ),
        );
    }

    if (!team1) {
      await db.insert(duo).values({
        name:
          sortedOpponentPlayer0.username +
          " + " +
          sortedOpponentPlayer1.username,
        user0: sortedOpponentPlayer0.id,
        user1: sortedOpponentPlayer1.id,
        skillMu: initial.mu,
        skillSigma: initial.sigma,
        rating: TeamRater.expose(initial),
        lastGameAt: new Date(),
      });
    } else {
      await db
        .update(duo)
        .set({
          lastGameAt: new Date(),
        })
        .where(
          and(
            eq(duo.user0, sortedOpponentPlayer0.id),
            eq(duo.user1, sortedOpponentPlayer1.id),
          ),
        );
    }

    const match = await db
      .insert(duoMatches)
      .values({
        player0: sortedMyPlayer0.id,
        player1: sortedMyPlayer1.id,
        player2: sortedOpponentPlayer0.id,
        player3: sortedOpponentPlayer1.id,
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
      rating: true,
      games: true,
      wins: true,
    },
    with: {
      user: true,
    },
    offset: cursor,
    limit: pageLength,
    orderBy: [desc(solo.rating)],
  });
};

export type DuoRankingEntry = Awaited<ReturnType<typeof getDuoRanking>>[number];

export const getDuoRanking = async (cursor: number, pageLength = 20) => {
  return await db.query.duo.findMany({
    columns: {
      name: true,
      rating: true,
      games: true,
      wins: true,
    },
    with: {
      user0: true,
      user1: true,
    },
    offset: cursor,
    limit: pageLength,
    orderBy: [desc(duo.rating)],
  });
};

export async function getMatches(cursor: number, pageLength = 10) {
  const { user } = await getSession();

  const idsWithDates = db
    .select({
      id: soloMatches.id,
      date: soloMatches.date,
    })
    .from(soloMatches)
    .where(
      or(eq(soloMatches.player0, user.id), eq(soloMatches.player1, user.id)),
    )
    .union(
      db
        .select({
          id: duoMatches.id,
          date: duoMatches.date,
        })
        .from(duoMatches)
        .where(
          or(
            eq(duoMatches.player0, user.id),
            eq(duoMatches.player1, user.id),
            eq(duoMatches.player2, user.id),
            eq(duoMatches.player3, user.id),
          ),
        ),
    )
    .orderBy(desc(soloMatches.date))
    .offset(cursor)
    .limit(pageLength)
    .as("idsWithDates");

  const ids = db.select({ id: idsWithDates.id }).from(idsWithDates);

  const [solos, duos] = await Promise.all([
    db.query.soloMatches.findMany({
      where: inArray(soloMatches.id, ids),
      columns: {
        id: true,
        date: true,
        score0: true,
        score1: true,
        draft: true,
        rating0Change: true,
        rating1Change: true,
      },
      with: { player0: true, player1: true },
    }),
    db.query.duoMatches.findMany({
      where: inArray(duoMatches.id, ids),
      columns: {
        id: true,
        date: true,
        score0: true,
        score1: true,
        draft: true,
        rating0Change: true,
        rating1Change: true,
        accept0: true,
        accept1: true,
        accept2: true,
        accept3: true,
      },
      with: {
        player0: true,
        player1: true,
        player2: true,
        player3: true,
        team0: true,
        team1: true,
      },
    }),
  ]);

  const solosTagged = solos.map((solo) => ({
    type: "solo" as const,
    match: solo,
  }));

  const duosTagged = duos.map((duo) => ({
    type: "duo" as const,
    match: duo,
  }));

  return [...duosTagged, ...solosTagged].sort(
    (a, b) => b.match.date.getTime() - a.match.date.getTime(),
  );
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
  } catch (error) {
    await db.delete(duoMatches).where(eq(duoMatches.id, args.id));

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

    const winnerRating = SoloRater.create(winner.skillMu, winner.skillSigma);
    const loserRating = SoloRater.create(loser.skillMu, loser.skillSigma);

    const { newWinnerRating, newLoserRating } = SoloRater.rate({
      winnerRating,
      loserRating,
    });

    await tx
      .update(solo)
      .set({
        skillMu: newWinnerRating.mu,
        skillSigma: newWinnerRating.sigma,
        rating: SoloRater.expose(newWinnerRating),
        wins: winner.wins + 1,
        games: winner.games + 1,
      })
      .where(eq(solo.user, winner.user));
    await tx
      .update(solo)
      .set({
        skillMu: newLoserRating.mu,
        skillSigma: newLoserRating.sigma,
        rating: SoloRater.expose(newLoserRating),
        games: loser.games + 1,
      })
      .where(eq(solo.user, loser.user));
    await tx.update(soloMatches).set({
      draft: false,
      rating0Change: SoloRater.expose(newWinnerRating) - winner.rating,
      rating1Change: SoloRater.expose(newLoserRating) - loser.rating,
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

    return { ok: true };
  } catch (error) {
    await db.delete(duoMatches).where(eq(duoMatches.id, args.id));

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

    const winnerRating = TeamRater.create(
      winnerTeam.skillMu,
      winnerTeam.skillSigma,
    );
    const loserRating = TeamRater.create(
      loserTeam.skillMu,
      loserTeam.skillSigma,
    );
    const { newWinnerRating, newLoserRating } = TeamRater.rate({
      winnerRating,
      loserRating,
    });

    await tx
      .update(duo)
      .set({
        skillMu: newWinnerRating.mu,
        skillSigma: newWinnerRating.sigma,
        rating: TeamRater.expose(newWinnerRating),
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
        rating: TeamRater.expose(newLoserRating),
        games: loserTeam.games + 1,
      })
      .where(
        and(eq(duo.user0, loserTeam.user0), eq(duo.user1, loserTeam.user1)),
      );
    await tx
      .update(duoMatches)
      .set({
        draft: false,
        rating0Change: TeamRater.expose(newWinnerRating) - winnerTeam.rating,
        rating1Change: TeamRater.expose(newLoserRating) - loserTeam.rating,
      })
      .where(eq(duoMatches.id, id));
  });
}
