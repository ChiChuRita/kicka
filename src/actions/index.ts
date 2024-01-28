"use server";

import { eq, ilike, ne } from "drizzle-orm";

import { db } from "@kicka/db";
import { getServerSession } from "next-auth";
import { users } from "@kicka/db/schema";

export async function deleteUser() {
  const session = await getServerSession();
  if (!session) return;
  await db.delete(users).where(eq(users.email, session.user?.email!));
}

export async function getAllUsers() {
  return await db.query.users.findMany();
}

export async function getAllUsersExcept(exceptEmail?: string) {
  if (!exceptEmail) return await getAllUsers();

  return await db.query.users.findMany({
    where: ne(users.email, exceptEmail),
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
