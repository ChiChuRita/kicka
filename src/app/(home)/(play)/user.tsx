"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";

import { Button } from "@kicka/components/ui/button";
import { getSession } from "@kicka/actions/auth";

export async function User() {
  const { user } = await getSession();

  return (
    <Button type="button" variant="outline" className="w-full justify-start">
      <Avatar className="mr-2 h-4 w-4">
        <AvatarImage src={user.image} />
        <AvatarFallback>{user.username}</AvatarFallback>
      </Avatar>
      {user.username}
    </Button>
  );
}
