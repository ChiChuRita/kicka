"use server";

export async function pullRandomShit() {
  return crypto.randomUUID();
}
