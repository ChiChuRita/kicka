"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import { acceptDuoGame } from "@kicka/actions";

import { Button } from "@kicka/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@kicka/lib/auth/useSession";
import { Duo, User } from "@kicka/lib/db/schema";
import { ReloadIcon } from "@radix-ui/react-icons";

interface GameProps {
  match: {
    id: string;
    date: Date;
    player0: User;
    player1: User;
    player2: User;
    player3: User;
    accept0: boolean;
    accept1: boolean;
    accept2: boolean;
    accept3: boolean;
    score0: number;
    score1: number;
    draft: boolean;
    mu0Change: number;
    mu1Change: number;
    team0: Duo;
    team1: Duo;
  };
}

export default function DuoMatch({ match }: GameProps) {
  const { data } = useSession();

  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: acceptDuoGame,
    onMutate: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //quick and dirty
  const players = [
    match.player0.id,
    match.player1.id,
    match.player2.id,
    match.player3.id,
  ];
  const acceptance = [
    match.accept0,
    match.accept1,
    match.accept2,
    match.accept3,
  ];
  const myIndex = data ? players.indexOf(data.user.id) : -1;
  const myAcceptance = acceptance[myIndex];

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-between">
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={match.player0.image} />
            <AvatarFallback>{match.player0.username[0]}</AvatarFallback>
          </Avatar>
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={match.player1.image} />
            <AvatarFallback>{match.player1.username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-row items-center justify-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded border">
            {match.score0}
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded border">
            {match.score1}
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={match.player2.image} />
            <AvatarFallback>{match.player2.username[0]}</AvatarFallback>
          </Avatar>
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={match.player3.image} />
            <AvatarFallback>{match.player3.username[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>
      {match.draft && (
        <div className="flex flex-row items-center justify-between gap-2">
          <span>Draft</span>
          <div className="flex flex-row gap-2">
            {data && !myAcceptance && (
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
