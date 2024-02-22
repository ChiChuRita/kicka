import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

import Hero from "./hero";
import Matches from "./matches";
import Play from "./(play)/play";
import { getSoloMatches } from "@kicka/actions";

export default async function Dashboard() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["matches"],
    queryFn: ({ pageParam }) => getSoloMatches(pageParam, 10),
    initialPageParam: 0,
  });

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
