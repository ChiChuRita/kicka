"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>More login options coming soon...</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signIn("github")}>Login with Github</Button>
      </CardContent>
    </Card>
  );
}
