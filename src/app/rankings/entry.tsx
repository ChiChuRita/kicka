import { SoloRankingEntry } from "@kicka/actions";
import { Avatar, AvatarImage } from "@kicka/components/ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Variants, motion } from "framer-motion";
import React from "react";

interface SoloRankingsProps {
  place: number;
  entry: SoloRankingEntry;
}

export default ({ place, entry }: SoloRankingsProps) => (
  <div className="flex flex-row justify-between rounded-sm border p-4">
    <div className="flex flex-row items-center">
      {/* <Avatar className="mr-2 h-6 w-6">
            <AvatarImage src={entry.user.image} alt={entry.user.username} />
            <AvatarFallback>{entry.user.username[0]}</AvatarFallback>
          </Avatar> */}
      <span>
        {place + 1}. {entry.user.username}
      </span>
    </div>
    <div className="flex flex-row gap-2">
      Skill: <span>{Math.round(entry.skill_mu)}</span>
      Wins: <span>{entry.wins}</span>
      Games: <span>{entry.games}</span>
    </div>
  </div>
);
