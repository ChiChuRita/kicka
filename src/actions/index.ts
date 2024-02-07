"use server";

import { eq, ilike, ne } from "drizzle-orm";
import { solo, users } from "@kicka/db/schema";

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

export const draftSoloGame = action(
  draftSoloGameSchema,
  async ({ opponent, myScore, opponentScore }) => {
    const session = await getSession();
    const player1 = await db.query.solo.findFirst({
      where: eq(solo.user, session.user.email),
    });
    const player2 = await db.query.solo.findFirst({
      where: eq(solo.user, opponent),
    });

    if (player1 && player2) {
      if (myScore > opponentScore) {
        await db
          .update(solo)
          .set({ wins: player1.wins + 1, games: player1.games + 1 })
          .where(eq(solo.user, player1.user));
      }
    }
    revalidatePath("/");
    revalidatePath("/rankings");
  },
);

export async function getGames(user: string) {
  const games = await db.query.solo.findFirst({
    where: eq(solo.user, user),
    columns: {
      games: true,
      wins: true,
    },
  });

  return games;
}
