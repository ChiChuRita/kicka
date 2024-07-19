import { Input } from "@kicka/components/ui/input";
import {
  FieldValues,
  UseControllerProps,
  useController,
  useFormContext,
} from "react-hook-form";
import { FormSchema } from "./duo";
import { useQuery } from "@tanstack/react-query";
import { getOwnTeamName } from "@kicka/actions";
import { useEffect } from "react";

export default function OwnTeamName<FM extends FieldValues>(
  props: UseControllerProps<FM>,
) {
  const { watch, setValue, getValues } = useFormContext<FormSchema>();
  const { field } = useController(props);

  const { data } = useQuery({
    queryFn: () => getOwnTeamName(getValues("user1")),
    queryKey: ["teamname", getValues("user1")],
  });

  const user1 = watch("user1");

  useEffect(() => {
    if (data === undefined) return;
    if (data) {
      setValue("teamName", data);
    }
  }, [user1, data, setValue]);

  return <Input type="text" {...field} />;
}
