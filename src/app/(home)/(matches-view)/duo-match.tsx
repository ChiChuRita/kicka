"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import { acceptDuoGame, getMatches } from "@kicka/actions";

import { Button } from "@kicka/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@kicka/lib/auth/useSession";
import { Duo, User } from "@kicka/lib/db/schema";
import { ReloadIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { matchesQueryOptions } from "../dashboard";

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
    rating0Change: number;
    rating1Change: number;
    team0: Duo;
    team1: Duo;
  };
}

type Matches = Awaited<ReturnType<typeof getMatches>>;

export default function DuoMatch({ match }: GameProps) {
  const { data } = useSession();

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

  const queryClient = useQueryClient();

  const { mutate, status } = useMutation({
    mutationFn: acceptDuoGame,
    onMutate: async (mutationData) => {
      await queryClient.cancelQueries(matchesQueryOptions);

      const previousMatches = queryClient.getQueryData(
        matchesQueryOptions.queryKey,
      );

      queryClient.setQueryData(matchesQueryOptions.queryKey, (old) => {
        if (!old) return;
        const entries = old.pages.flatMap((page) => page);
        let entry = entries.find((entry) => entry.match.id === mutationData.id);
        if (!mutationData.accept) {
          old.pages = old.pages.map((page) =>
            page.filter((entry) => entry.match.id !== mutationData.id),
          );
          return old;
        }
        if (entry?.type === "duo") {
          switch (myIndex) {
            case 0:
              entry.match.accept0 = mutationData.accept;
              break;
            case 1:
              entry.match.accept1 = mutationData.accept;
              break;
            case 2:
              entry.match.accept2 = mutationData.accept;
              break;
            case 3:
              entry.match.accept3 = mutationData.accept;
              break;
          }
        }

        return old;
      });

      return { previousMatches };
    },
    onError: (error) => {
      console.log(error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["matches"],
      });
    },
  });

  return (
    <div className="flex flex-col gap-4 rounded-md border p-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-between">
          <Avatar
            className={clsx(
              "mr-2 h-6 w-6",
              match.draft && "border-2",
              match.accept0 ? "border-green-400" : "border-red-400",
            )}
          >
            <AvatarImage src={match.player0.image} />
            <AvatarFallback>{match.player0.username[0]}</AvatarFallback>
          </Avatar>
          <Avatar
            className={clsx(
              "mr-2 h-6 w-6",
              match.draft && "border-2",
              match.accept1 ? " border-green-400" : "border-red-400",
            )}
          >
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
          <Avatar
            className={clsx(
              "mr-2 h-6 w-6",
              match.draft && "border-2",
              match.accept2 ? " border-green-400" : " border-red-400",
            )}
          >
            <AvatarImage src={match.player2.image} />
            <AvatarFallback>{match.player2.username[0]}</AvatarFallback>
          </Avatar>
          <Avatar
            className={clsx(
              "mr-2 h-6 w-6",
              match.draft && "border-2",
              match.accept3 ? "border-green-400" : "border-red-400",
            )}
          >
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
