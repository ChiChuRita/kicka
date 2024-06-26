"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import { GetSoloMatch, acceptSoloGame } from "@kicka/actions";

import { Button } from "@kicka/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@kicka/lib/auth/useSession";

interface GameProps {
  match: GetSoloMatch;
}

export default function Match({ match }: GameProps) {
  const { data } = useSession();

  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: acceptSoloGame,
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
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="flex flex-row items-center justify-between">
        <Button className="w-40" variant={"outline"}>
          <Avatar className="mr-2 h-4 w-4">
            <AvatarImage src={match.player0.image} />
            <AvatarFallback>{match.player0.username[0]}</AvatarFallback>
          </Avatar>
          {match.player0.username}
        </Button>
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded border">
            {match.score0}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded border">
            {match.score1}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Button variant={"outline"} className="w-40 ">
            <Avatar className="mr-2 h-4 w-4">
              <AvatarImage src={match.player1.image} />
              <AvatarFallback>{match.player1.username[0]}</AvatarFallback>
            </Avatar>
            {match.player1.username}
          </Button>
        </div>
      </div>
      {match.draft && (
        <div className="flex flex-row items-center justify-between gap-2">
          <span>Draft</span>
          <div className="flex flex-row gap-2">
            {data && data.user.id != match.player0.id && (
              <Button
                onClick={() => mutate({ accept: true, id: match.id })}
                variant="secondary"
                className="w-24"
                disabled={status === "pending"}
              >
                Accept
              </Button>
            )}

            <Button
              onClick={() => mutate({ accept: false, id: match.id })}
              variant="destructive"
              className="w-24"
              disabled={status === "pending"}
            >
              Decline
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
