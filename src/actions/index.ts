"use server";

import { test } from "../db/schema";
import { db } from "../db";

export async function addRandomShit() {
  await db.insert(test).values({
    name: crypto.randomUUID(),
  });
}

export async function getRandomShit() {
  return await db.select().from(test);
}
