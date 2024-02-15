"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";

import { Button } from "@kicka/components/ui/button";
import { getSession } from "@kicka/actions/auth";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "@kicka/lib/auth/useSession";

export function User() {
  const { data } = useSession();

  return (
    <Button type="button" variant="outline" className="w-full justify-start">
      {data && (
        <>
          <Avatar className="mr-2 h-4 w-4">
            <AvatarImage src={data.user.image} />
            <AvatarFallback>{data.user.username}</AvatarFallback>
          </Avatar>
          {data.user.username}
        </>
      )}
    </Button>
  );
}
