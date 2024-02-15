import { GitHub, Google } from "arctic";
import { User, sessions, users } from "@kicka/lib/db/schema";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";
import { cache } from "react";
import { cookies } from "next/headers";
import { db } from "@kicka/lib/db";
import { redirect } from "next/navigation";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      image: attributes.image,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<User, "id">;
  }
}

export const validateRequest = cache(async () => {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  // next.js throws when you attempt to set cookie when rendering page
  try {
    if (result.session && result.session.fresh) {
      const sessionCookie = lucia.createSessionCookie(result.session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
    if (!result.session) {
      const sessionCookie = lucia.createBlankSessionCookie();
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
    }
  } catch {}
  return result;
});

export const github =
  process.env.NODE_ENV === "production"
    ? new GitHub(process.env.GITHUB_ID!, process.env.GITHUB_SECRET!)
    : new GitHub(process.env.DEV_GITHUB_ID!, process.env.DEV_GITHUB_SECRET!);

export const google =
  process.env.NODE_ENV === "production"
    ? new Google(
        process.env.GOOGLE_ID!,
        process.env.GOOGLE_SECRET!,
        "https://kicka.vercel.app/login/google/callback",
      )
    : new Google(
        process.env.DEV_GOOGLE_ID!,
        process.env.DEV_GOOGLE_SECRET!,
        "http://localhost:3000/login/google/callback",
      );
