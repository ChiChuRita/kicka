"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";

import { Button } from "@kicka/components/ui/button";
import { useSession } from "next-auth/react";

export function User() {
  const { data: session, status } = useSession();

  return (
    <Button variant="outline" className="w-full justify-start">
      {status === "authenticated" && (
        <>
          <Avatar className="mr-2 h-4 w-4">
            <AvatarImage src={session.user?.image!} />
            <AvatarFallback>{session.user?.name}</AvatarFallback>
          </Avatar>
          {session.user?.name}
        </>
      )}
    </Button>
  );
}
