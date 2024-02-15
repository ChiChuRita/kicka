"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@kicka/components/ui/card";

import { Button } from "@kicka/components/ui/button";
import GithubIcon from "../../../public/github-mark-white.svg";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Link href="/login">
          <Button variant="secondary">
            <Image
              src={GithubIcon}
              alt="github logo"
              className="mr-2 h-4 w-4"
            />
            Login with Github
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
