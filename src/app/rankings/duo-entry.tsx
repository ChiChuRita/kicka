import type { DuoRankingEntry } from "@kicka/actions";
import { Avatar, AvatarImage } from "@kicka/components/ui/avatar";
import { AvatarFallback } from "@kicka/components/ui/avatar";
import React from "react";

interface DuoRankingsProps {
  place: number;
  entry: DuoRankingEntry;
}

export default function DuoRankingEntry({ place, entry }: DuoRankingsProps) {
  return (
    <div className="flex flex-row justify-between rounded-md border p-3">
      <div className="flex flex-row items-center">
        <Avatar className="mr-2 h-6 w-6">
          {/* <AvatarImage src={entry.user.image} alt={entry.user.username} /> */}
          <AvatarFallback>{entry.name}</AvatarFallback>
        </Avatar>
        <span>{entry.name}</span>
      </div>
      <div className="flex flex-row gap-2">
        Skill: <span>{Math.round(entry.skillMu)}</span>
        Wins: <span>{entry.wins}</span>
      </div>
    </div>
  );
}
