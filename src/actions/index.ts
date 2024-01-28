"use server";

import { eq, ilike, ne } from "drizzle-orm";

import { db } from "@kicka/db";
import { getServerSession } from "next-auth";
import { users, solo } from "@kicka/db/schema";

export async function deleteUser() {
  const session = await getServerSession();
  if (!session) return;
  await db.delete(users).where(eq(users.email, session.user?.email!)).execute();
}

export async function getAllUsers() {
  return await db.query.users.findMany().execute();
}

export async function getAllUsersExcept(exceptEmail?: string) {
  if (!exceptEmail) return await getAllUsers();

  return await db.query.users
    .findMany({
      where: ne(users.email, exceptEmail),
    })
    .execute();
}

export async function getUserByName(name: string) {
  return await db.query.users
    .findMany({
      where: ilike(users.name, `${name}%`),
    })
    .execute();
}

export async function getUserByEmail(email: string) {
  return await db.query.users
    .findMany({
      where: ilike(users.email, `${email}%`),
    })
    .execute();
}

export async function draftSoloGame(
  player1Email: string,
  player2Email: string,
  score1: number,
  score2: number,
) {
  const player1 = await db.query.solo.findFirst({
    where: eq(solo.user, player1Email),
  });

  await db
    .update(solo)
    .set({
      elo: player1!.elo + score1,
    })
    .where(eq(solo.user, player1Email))
    .execute();
}

export async function getElo(user: string) {
  const player = await db.query.solo.findFirst({
    where: eq(solo.user, user),
  });

  return player ? player.elo : 0;
}
