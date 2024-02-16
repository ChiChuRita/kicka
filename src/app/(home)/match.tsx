"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import { GetSoloMatch, acceptSoloGame } from "@kicka/actions";

import { Button } from "@kicka/components/ui/button";
import { Card } from "@kicka/components/ui/card";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "@kicka/lib/auth/useSession";

interface GameProps {
  match: GetSoloMatch;
}

export default function Match({ match }: GameProps) {
  const { data } = useSession();

  const queryClient = useQueryClient();

  const { execute, status, result } = useAction(acceptSoloGame, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Card className="flex flex-col gap-4 p-4">
      <span>{JSON.stringify(match, null, 2)}</span>
      {data && match.draft && data.user.id != match.player0.id && (
        <Button
          onClick={() => execute({ accept: true, id: match.id })}
          variant="secondary"
          disabled={status === "executing"}
        >
          Accept
        </Button>
      )}
      {match.draft && (
        <Button
          onClick={() => execute({ accept: false, id: match.id })}
          variant="destructive"
          disabled={status === "executing"}
        >
          Decline
        </Button>
      )}
    </Card>
  );
}
