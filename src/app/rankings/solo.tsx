"use client";

import { Variants, useInView } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";
import SoloRankingEntry from "./entry";
import { getSoloRanking } from "@kicka/actions";
import { useEffect, useRef } from "react";

export default function SoloRankings() {
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["solo-ranking"],
    queryFn: ({ pageParam }) => getSoloRanking(pageParam),
    initialPageParam: 0,
    getNextPageParam: (_, pages) => pages.length + 1,
  });

  const entries = data?.pages.flatMap((page) => page);

  const lastEntryRef = useRef(null);
  const isinView = useInView(lastEntryRef);

  useEffect(() => {
    if (isinView) {
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
      <span ref={lastEntryRef}>Loading...</span>
    </div>
  );
}
