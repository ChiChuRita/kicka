"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@kicka/components/ui/card";

import Match from "./match";
import { getSoloMatches } from "@kicka/actions";
import { useQuery } from "@tanstack/react-query";

export default function Games() {
  const { data } = useQuery({
    queryKey: ["matches"],
    queryFn: () => getSoloMatches(),
    refetchInterval: 5000,
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Games</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data?.map((match) => <Match key={match.id} match={match} />)}
      </CardContent>
    </Card>
  );
}
