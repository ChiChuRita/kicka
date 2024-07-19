"use client";

import { useEffect, useRef } from "react";

import DuoRankingEntry from "./duo-entry";
import { getDuoRanking } from "@kicka/actions";
import { useInView } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";

const pageLength = 10;

export default function DuoRankings() {
  const { data, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery({
      queryKey: ["duo-ranking"],
      queryFn: ({ pageParam }) => getDuoRanking(pageParam, pageLength),
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
        <DuoRankingEntry
          entry={entry}
          place={idx}
          key={entry.user0 + entry.user1}
        />
      ))}
      <span ref={lastEntryRef}>{isFetchingNextPage && "Loading..."}</span>
    </div>
  );
}
