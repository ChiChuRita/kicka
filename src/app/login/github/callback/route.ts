import { github, lucia } from "@kicka/lib/auth";
import { solo, users } from "@kicka/lib/db/schema";

import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { db } from "@kicka/lib/db";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { SoloRater } from "@kicka/lib/skill";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const githubUserEmailResponse = await fetch(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const githubUserEmails: GitHubUserEmail[] =
      await githubUserEmailResponse.json();

    const githubUserEmail = githubUserEmails.find((email) => email.primary)!;
    const githubUser: GitHubUser = await githubUserResponse.json();

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, githubUserEmail.email),
    });

    if (existingUser) {
      await db
        .update(users)
        .set({ image: githubUser.avatar_url, lastOnlineAt: new Date() })
        .where(eq(users.id, existingUser.id));
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateId(15);
    await db.insert(users).values({
      id: userId,
      githubId: githubUser.id,
      username: githubUser.login,
      email: githubUserEmail.email,
      image: githubUser.avatar_url,
    });

    const initalRating = SoloRater.create();
    await db.insert(solo).values({
      user: userId,
      skillMu: initalRating.mu,
      skillSigma: initalRating.sigma,
      rating: SoloRater.expose(initalRating),
    });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    console.error(e);
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}

interface GitHubUser {
  id: string;
  login: string;
  email: string;
  avatar_url: string;
}

interface GitHubUserEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: "private " | null;
}
