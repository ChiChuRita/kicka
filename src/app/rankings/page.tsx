"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kicka/components/ui/tabs";

import Header from "@kicka/components/header";
import SoloRankings from "./solo";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getSoloRanking } from "@kicka/actions";

export default async function Rankings() {
  // const queryClient = new QueryClient();

  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: ["solo-ranking"],
  //   queryFn: ({ pageParam }) => getSoloRanking(pageParam),
  //   initialPageParam: 0,
  // });

  return (
    <>
      <Header title="Rankings" />
      <Tabs defaultValue="solo">
        <TabsList className="flex w-36 flex-row">
          <TabsTrigger className="w-full" value="solo">
            Solo
          </TabsTrigger>
          <TabsTrigger className="w-full" value="duo">
            Duo
          </TabsTrigger>
        </TabsList>
        <span className="text-red-500">This is just a UI preview!</span>
        <TabsContent value="solo">
          <SoloRankings />
        </TabsContent>
        <TabsContent value="duo">Here are the duo rankings.</TabsContent>
      </Tabs>
    </>
  );
}
