"use client";

import { useEffect, useRef } from "react";

import TeamRankingEntry from "./team-entry";
import { getTeamRanking } from "@kicka/actions";
import { useInView } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ReloadIcon } from "@radix-ui/react-icons";

const pageLength = 10;

export default function TeamRankings() {
  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["team-ranking"],
      queryFn: ({ pageParam }) => getTeamRanking(pageParam, pageLength),
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => pages.length * pageLength,
    });

  const entries = data?.pages.flatMap((page) => page);

  const lastEntryRef = useRef(null);
  const isInView = useInView(lastEntryRef);

  useEffect(() => {
    if (isInView && !isFetching) {
      fetchNextPage();
    }
  }, [isInView]);

  return (
    <div className="flex flex-col gap-2">
      {entries?.map((entry, idx) => (
        <TeamRankingEntry
          entry={entry}
          place={idx}
          key={entry.user0.username + entry.user1.username}
        />
      ))}
      <span
        ref={lastEntryRef}
        className="flex flex-row items-center justify-center"
      >
        {isFetchingNextPage && (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Loading...
          </>
        )}
      </span>
    </div>
  );
}
