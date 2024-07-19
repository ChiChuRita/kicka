import { Input } from "@kicka/components/ui/input";
import { useFormContext } from "react-hook-form";
import { FormSchema } from "./duo";
import { useQuery } from "@tanstack/react-query";
import { getTeamName } from "@kicka/actions";
import { useEffect } from "react";
import { Card } from "@kicka/components/ui/card";

export default function OpponentTeamName() {
  const { watch, getValues } = useFormContext<FormSchema>();

  const { refetch, data } = useQuery({
    queryKey: ["teamname", getValues("user2"), getValues("user3")],
    queryFn: () => getTeamName(getValues("user2"), getValues("user3")),
  });

  const user2 = watch("user2");
  const user3 = watch("user3");

  useEffect(() => {
    refetch();
  }, [user2, user3, refetch]);

  return <Input type="text" value={data || ""} readOnly />;
}
