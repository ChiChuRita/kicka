"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function Login() {
  console.log(process.env.NODE_ENV);
  return <Button onClick={() => signIn("github")}>Login with Github</Button>;
}
