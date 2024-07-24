"use client";

import { useEffect, useRef } from "react";

import { getMatches } from "@kicka/actions";
import { useInView } from "framer-motion";
import {
  infiniteQueryOptions,
  queryOptions,
  useInfiniteQuery,
} from "@tanstack/react-query";

import SoloMatch from "./solo-match";
import DuoMatch from "./duo-match";
import { ReloadIcon } from "@radix-ui/react-icons";

const pageLength = 10;

export const matchesQueryOptions = infiniteQueryOptions({
  queryKey: ["matches"],
  queryFn: ({ pageParam }) => getMatches(pageParam, pageLength),
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => pages.length * pageLength,
  refetchInterval: 5_000,
});

export default function Matches() {
  const { fetchNextPage, data, isFetching, isFetchingNextPage } =
    useInfiniteQuery(matchesQueryOptions);

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
    </div>
  );
}
