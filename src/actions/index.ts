"use server";

import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { getServerSession } from "next-auth";

export async function deleteUser() {
  const session = await getServerSession();
  if (!session) return;
  await db.delete(users).where(eq(users.email, session.user?.email!));
}

export async function getAllUsers() {
  return await db.query.users.findMany();
}
