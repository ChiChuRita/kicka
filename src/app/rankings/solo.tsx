"use client";

import { useEffect, useRef } from "react";

import SoloRankingEntry from "./entry";
import { getSoloRanking } from "@kicka/actions";
import { useInView } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";

const pageLength = 10;

export default function SoloRankings() {
  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["solo-ranking"],
      queryFn: ({ pageParam }) => getSoloRanking(pageParam, pageLength),
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
        <SoloRankingEntry entry={entry} place={idx} key={entry.user.id} />
      ))}
      <span ref={lastEntryRef}>{isFetchingNextPage && "Loading..."}</span>
    </div>
  );
}
