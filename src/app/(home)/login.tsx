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

import GithubIcon from "../../../public/github-mark-white.svg";

import Image from "next/image";

export default function Login() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => signIn("github")} variant="secondary">
          <Image src={GithubIcon} alt="github logo" className="mr-2 h-4 w-4" />
          Login with Github
        </Button>
      </CardContent>
      <CardFooter className="text-muted-foreground">
        More login options coming soon...
      </CardFooter>
    </Card>
  );
}
