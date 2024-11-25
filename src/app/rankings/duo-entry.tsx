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
      <div className="flex flex-row items-center gap-1">
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-right font-medium tabular-nums">
            {Math.round(entry.rating)}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-8 text-right font-medium tabular-nums">
            {entry.wins}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-yellow-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
