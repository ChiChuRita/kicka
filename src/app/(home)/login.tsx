"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <Button
      onClick={() =>
        signIn("github", {
          callbackUrl:
            process.env.NODE_ENV === "development"
              ? "http://localhost:3000/api/auth/callback"
              : "https://hpi-kicka.vercel.app/api/auth/callback",
        })
      }
    >
      Login with Github
    </Button>
  );
}
