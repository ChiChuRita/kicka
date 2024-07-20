"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import { acceptSoloGame } from "@kicka/actions";

import { Button } from "@kicka/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@kicka/lib/auth/useSession";
import { User } from "@kicka/lib/db/schema";
import { ReloadIcon } from "@radix-ui/react-icons";

interface GameProps {
  match: {
    id: string;
    date: Date;
    score0: number;
    score1: number;
    draft: boolean;
    mu0Change: number;
    mu1Change: number;
    player0: User;
    player1: User;
  };
}

export default function SoloMatch({ match }: GameProps) {
  const { data } = useSession();

  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: acceptSoloGame,
    onMutate: async (data) => {
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
        <Avatar className="h-8 w-8">
          <AvatarImage src={match.player0.image} />
          <AvatarFallback>{match.player0.username[0]}</AvatarFallback>
        </Avatar>
        {/* {match.player0.username} */}
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded border">
            {match.score0}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded border">
            {match.score1}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Avatar className="mr-2 h-8 w-8">
            <AvatarImage src={match.player1.image} />
            <AvatarFallback>{match.player1.username[0]}</AvatarFallback>
          </Avatar>
          {/* {match.player1.username} */}
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
                {status === "pending" ? (
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>Accept</>
                )}
              </Button>
            )}

            <Button
              onClick={() => mutate({ accept: false, id: match.id })}
              variant="destructive"
              className="w-24"
              disabled={status === "pending"}
            >
              {status === "pending" ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>Decline</>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
