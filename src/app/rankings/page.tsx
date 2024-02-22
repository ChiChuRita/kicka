import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kicka/components/ui/tabs";

import Header from "@kicka/components/header";
import Image from "next/image";
import SoloRankings from "./solo";
import { getSoloRanking } from "@kicka/actions";

export default async function Rankings() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["solo-ranking"],
    queryFn: ({ pageParam }) => getSoloRanking(pageParam, 20),
    initialPageParam: 0,
  });

  return (
    <>
      <Header title="Rankings" />
      <Tabs defaultValue="solo">
        <TabsList className="flex w-36 flex-row">
          <TabsTrigger className="w-full" value="solo">
            <Image
              src="solo.svg"
              width={10}
              height={10}
              alt="solo image"
              className="mr-1"
            />
            Solo
          </TabsTrigger>
          <TabsTrigger className="w-full" value="duo">
            <Image
              src="duo.svg"
              width={15}
              height={10}
              alt="duo image"
              className="mr-1"
            />
            Duo
          </TabsTrigger>
        </TabsList>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <TabsContent value="solo">
            <SoloRankings />
          </TabsContent>
          <TabsContent value="duo">Here are the duo rankings.</TabsContent>
        </HydrationBoundary>
      </Tabs>
    </>
  );
}
