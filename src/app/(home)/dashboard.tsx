import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import Hero from "./hero";
import Matches, { matchesQueryOptions } from "./(matches-view)/matches";
import Play from "./(play)/play";

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
