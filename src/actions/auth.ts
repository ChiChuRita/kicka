"use server";

import { lucia, validateRequest } from "@kicka/lib/auth";

import { cookies } from "next/headers";
import { db } from "@kicka/lib/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { users } from "@kicka/lib/db/schema";

export const getSession = async () => {
  const result = await validateRequest();
  if (!result.session) return redirect("/");
  return result;
};

export const logout = async () => {
  const { session } = await getSession();

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
};

export const login = async () => {
  "use server";
  return redirect("/login");
};

export const deleteUser = async () => {
  const { user } = await getSession();

  await db.delete(users).where(eq(users.id, user.id));

  await logout();
};
