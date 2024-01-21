import { users } from "@/db/schema";
import { db } from "../../../../db";
import NextAuth, { AuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { eq } from "drizzle-orm";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET!,
  events: {
    signIn: async (login) => {
      const user = await db.query.users.findFirst({
        where: eq(users.email, login.user.email || ""),
      });

      if (user) return;

      await db.insert(users).values({
        email: login.user.email!,
        name: login.user.name!,
        image: login.user.image,
      });
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/settings",
  },
} satisfies AuthOptions;

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
