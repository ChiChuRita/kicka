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
      <div className="flex max-w-full flex-row items-center truncate">
        <div className="flex flex-row items-center justify-between">
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={entry.user0.image} />
            <AvatarFallback>{entry.user0.username[0]}</AvatarFallback>
          </Avatar>
          <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={entry.user1.image} />
            <AvatarFallback>{entry.user1.username[0]}</AvatarFallback>
          </Avatar>
        </div>
        <span>{entry.name}</span>
      </div>
      <div className="flex flex-row gap-2">
        <span>{Math.round(entry.rating)}</span>
        <span>{entry.wins}</span>
      </div>
    </div>
  );
}
