"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import { GetSoloMatch, acceptSoloGame } from "@kicka/actions";

import { Button } from "@kicka/components/ui/button";
import { Card } from "@kicka/components/ui/card";
import { cn } from "@kicka/lib/utils";
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
      <div className="flex flex-col gap-2">
        <div className="flex flex-row items-center justify-between">
          <Button variant={"outline"}>
            <Avatar className="mr-2 h-4 w-4">
              <AvatarImage src={match.player0.image} />
              <AvatarFallback>{match.player0.username[0]}</AvatarFallback>
            </Avatar>
            {match.player0.username}
          </Button>
          <span
            className={
              Math.round(match.mu1Change) > 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {Math.round(match.mu1Change)}
          </span>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-border">
            {match.score0}
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded bg-border">
            {match.score1}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Button variant={"outline"}>
            <Avatar className="mr-2 h-4 w-4">
              <AvatarImage src={match.player1.image} />
              <AvatarFallback>{match.player1.username[0]}</AvatarFallback>
            </Avatar>
            {match.player1.username}
          </Button>
          <span
            className={
              Math.round(match.mu0Change) > 0
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {Math.round(match.mu0Change)}
          </span>
        </div>
      </div>
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
