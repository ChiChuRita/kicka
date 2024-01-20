import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";

const handler = NextAuth({
  secret: "rahul",
  providers: [
    GithubProvider({
      clientId: "sdf",
      clientSecret: "dsf",
    }),
  ],
});

export { handler as GET, handler as POST };
