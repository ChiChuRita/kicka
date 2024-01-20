import { users } from "@/db/schema";
import { db } from "../../../../db";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { eq } from "drizzle-orm";

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET!,
  events: {
    createUser: async ({ user }) => {
      await db
        .insert(users)
        .values({ email: "ra.singh069@gmail.com", name: "rahul", elo: 1500 });
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
