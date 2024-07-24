import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  infiniteQueryOptions,
} from "@tanstack/react-query";

import Hero from "./hero";
import Matches from "./(matches-view)/matches";
import Play from "./(play)/play";
import { getMatches } from "@kicka/actions";

const pageLength = 10;

export const matchesQueryOptions = infiniteQueryOptions({
  queryKey: ["matches"],
  queryFn: ({ pageParam }) => getMatches(pageParam, pageLength),
  initialPageParam: 0,
  getNextPageParam: (lastPage, pages) => pages.length * pageLength,
  refetchInterval: 5_000,
});

export default async function Dashboard() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery(matchesQueryOptions);

  return (
    <div className="flex w-full flex-col gap-5">
      <Hero />
      <Play />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Matches />
      </HydrationBoundary>
    </div>
  );
}
