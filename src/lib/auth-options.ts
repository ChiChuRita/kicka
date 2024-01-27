import { eq } from "drizzle-orm";
import { AuthOptions } from "next-auth";
import GithubProvider, { GithubProfile } from "next-auth/providers/github";

import { db } from "@/db";
import { users } from "@/db/schema";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    signIn: async (login) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, login.user.email || ""),
      });

      if (user?.image !== login.user.image)
        await db
          .update(users)
          .set({ image: login.user.image! })
          .where(eq(users.email, login.user.email || ""));

      if (user) return true;

      await db.insert(users).values({
        email: login.user.email!,
        name: login.user.name!,
        image: login.user.image!,
      });

      return true;
    },
    session: async ({ session }) => {
      return {
        ...session,
        user: {
          name: session.user!.name!,
          email: session.user!.email!,
          image: session.user!.image!,
        },
      };
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
          },
    ),
  ],
  pages: {
    signIn: "/",
    signOut: "/settings",
  },
} satisfies AuthOptions;
