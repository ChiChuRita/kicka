"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import UserSelect from "./user-select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function User() {
  const { data: session, status } = useSession();

  return status === "authenticated" ? (
    <Button variant="outline" className="justify-start">
      <Avatar className="mr-2 h-4 w-4">
        <AvatarImage src={session.user?.image!} />
        <AvatarFallback>{session.user?.name}</AvatarFallback>
      </Avatar>
      <span>{session.user?.name}</span>
    </Button>
  ) : null;
}
export default function Single() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Single</CardTitle>
        <CardDescription>Play against one opponent</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <UserSelect />
        <User />
      </CardContent>
    </Card>
  );
}
