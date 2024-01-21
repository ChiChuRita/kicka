import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

import GithubProvider from "next-auth/providers/github";
import { AuthOptions } from "next-auth";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    signIn: async (login) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, login.user.email || ""),
      });

      if (user) return true;

      await db.insert(users).values({
        email: login.user.email!,
        name: login.user.name!,
        image: login.user.image,
      });

      return true;
    },
  },
  providers: [
    GithubProvider(
      process.env.NODE_ENV === "production"
        ? {
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
          }
        : {
            clientId: process.env.DEV_GITHUB_ID!,
            clientSecret: process.env.DEV_GITHUB_SECRET!,
          }
    ),
  ],
  pages: {
    signIn: "/",
    signOut: "/settings",
  },
} satisfies AuthOptions;
