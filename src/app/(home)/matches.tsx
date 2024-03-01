"use client";

import { useEffect, useRef } from "react";

import Match from "./match";
import { getSoloMatches } from "@kicka/actions";
import { useInView } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";

const pageLength = 10;

export default function Matches() {
  const { fetchNextPage, data, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["matches"],
      queryFn: ({ pageParam }) => getSoloMatches(pageParam, pageLength),
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => pages.length * pageLength,
      refetchInterval: 2000,
    });

  const matches = data?.pages.flatMap((page) => page);

  const lastEntryRef = useRef(null);
  const isInView = useInView(lastEntryRef);

  useEffect(() => {
    if (isInView && !isFetching) {
      fetchNextPage();
    }
  }, [isInView]);

  return (
    <div className="flex flex-col gap-4">
      <h3>Matches</h3>
      <div className="flex flex-col gap-2">
        {matches?.map((match) => <Match key={match.id} match={match} />)}
        <span ref={lastEntryRef}>{isFetchingNextPage && "Loading..."}</span>
      </div>
    </div>
  );
}
