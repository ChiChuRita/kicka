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

export default function Matches() {
  const { data } = useQuery({
    queryKey: ["matches"],
    queryFn: () => getSoloMatches(),
    refetchInterval: 2500,
  });

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <CardTitle>Matches</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {data?.map((match) => <Match key={match.id} match={match} />)}
      </CardContent>
    </Card>
  );
}
