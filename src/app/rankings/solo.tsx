"use client";

import { useEffect, useRef } from "react";

import SoloRankingEntry from "./entry";
import { getSoloRanking } from "@kicka/actions";
import { useInView } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";

const pageLength = 20;

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
  const isinView = useInView(lastEntryRef);

  useEffect(() => {
    if (isinView && !isFetching) {
      fetchNextPage();
      console.log("fetching next page");
    }
    console.log("in view", isinView);
  }, [isinView]);

  return (
    <div className="flex flex-col gap-2">
      {entries?.map((entry, idx) => (
        <SoloRankingEntry entry={entry} place={idx} key={entry.user.id} />
      ))}
      <span ref={lastEntryRef}>{isFetchingNextPage && "Loading..."}</span>
    </div>
  );
}
