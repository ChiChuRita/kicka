"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Login() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signIn("github")}>Login with Github</Button>
      </CardContent>
      <CardFooter className="text-muted-foreground">
        More login options coming soon...
      </CardFooter>
    </Card>
  );
}
