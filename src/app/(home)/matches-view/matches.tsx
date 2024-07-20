"use client";

import { useEffect, useRef } from "react";

import { getMatches } from "@kicka/actions";
import { useInView } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";

import SoloMatch from "./solo-match";
import DuoMatch from "./duo-match";

const pageLength = 10;

export default function Matches() {
  const { fetchNextPage, data, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["matches"],
      queryFn: ({ pageParam }) => getMatches(pageParam, pageLength),
      initialPageParam: 0,
      getNextPageParam: (lastPage, pages) => pages.length * pageLength,
      refetchInterval: 15_000,
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
        {matches?.map((match) =>
          match.type == "solo" ? (
            <SoloMatch key={match.match.id} match={match.match} />
          ) : (
            <DuoMatch key={match.match.id} match={match.match} />
          ),
        )}
        <span ref={lastEntryRef}>{isFetchingNextPage && "Loading..."}</span>
      </div>
    </div>
  );
}
