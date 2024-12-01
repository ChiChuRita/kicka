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
import { getTeamRanking, getSoloRanking } from "@kicka/actions";
import DuoRankings from "./duo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@kicka/components/ui/carousel";

export default async function Rankings() {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["solo-ranking"],
    queryFn: ({ pageParam }) => getSoloRanking(pageParam, 20),
    initialPageParam: 0,
  });

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["duo-ranking"],
    queryFn: ({ pageParam }) => getTeamRanking(pageParam, 20),
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
          <TabsTrigger className="w-full" value="team">
            <Image
              src="team.svg"
              width={15}
              height={10}
              alt="team image"
              className="mr-1"
            />
            Team
          </TabsTrigger>
        </TabsList>
        <HydrationBoundary state={dehydrate(queryClient)}>
          {/* <Carousel> */}
          {/* <CarouselContent> */}
          {/* <CarouselItem> */}
          <TabsContent value="solo">
            <SoloRankings />
          </TabsContent>
          {/* </CarouselItem> */}
          {/* <CarouselItem> */}
          <TabsContent value="duo">
            <DuoRankings />
          </TabsContent>
          {/* </CarouselItem>
            </CarouselContent>
          </Carousel> */}
        </HydrationBoundary>
      </Tabs>
    </>
  );
}
