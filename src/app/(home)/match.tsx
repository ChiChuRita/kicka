"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import { GetSoloMatch, acceptSoloGame } from "@kicka/actions";

import { Button } from "@kicka/components/ui/button";
import { Card } from "@kicka/components/ui/card";
import { timeAgo } from "@kicka/lib/time";
import { useAction } from "next-safe-action/hooks";
import { useQueryClient } from "@tanstack/react-query";

interface GameProps {
  match: GetSoloMatch;
}

export default function Match({ match }: GameProps) {
  const queryClient = useQueryClient();

  const { execute, status, result } = useAction(acceptSoloGame, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["matches"],
      }),
        console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <Card className="flex flex-col gap-4 p-4">
      <div className="flex flex-row justify-between">
        <Button variant="outline" className="w-48 justify-start">
          <Avatar className="mr-2 h-4 w-4">
            <AvatarImage src={match.player0.image} />
            <AvatarFallback>{match.player0.username}</AvatarFallback>
          </Avatar>
          {match.player0.username}
        </Button>
        <div className="flex flex-col justify-center">
          {match.score0} : {match.score1}
        </div>
        <Button variant="outline" className="w-48 justify-start">
          <Avatar className="mr-2 h-4 w-4">
            <AvatarImage src={match.player1.image} />
            <AvatarFallback>{match.player1.username}</AvatarFallback>
          </Avatar>
          {match.player1.username}
        </Button>
      </div>
      <div className="flex flex-row items-center justify-between gap-4">
        <span>{timeAgo.format(match.date)}</span>
        <div className="flex flex-row gap-2">
          {/* {match.draft && session?.user?.email != match.player0.email && (
            <Button
              onClick={() => execute({ accept: true, id: match.id })}
              variant="secondary"
              disabled={status === "executing"}
            >
              Accept
            </Button>
          )} */}
          {match.draft && (
            <Button
              onClick={() => execute({ accept: false, id: match.id })}
              variant="destructive"
              disabled={status === "executing"}
            >
              Decline
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
