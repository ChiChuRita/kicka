import { generateCodeVerifier, generateState } from "arctic";

import { cookies } from "next/headers";
import { google } from "@kicka/lib/auth";

export async function GET(): Promise<Response> {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["email", "profile"],
  });

  cookies().set("google_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  // store code verifier as cookie
  cookies().set("google_code_verifier", codeVerifier, {
    secure: process.env.NODE_ENV === "production",
    path: "/",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}
