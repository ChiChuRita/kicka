"use server";

import { users } from "../db/schema";
import { db } from "../db";

export async function getRandomShit() {
  return await db.select().from(users);
}
