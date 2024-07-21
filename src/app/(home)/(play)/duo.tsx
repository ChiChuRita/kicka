"use client";

import { Button } from "@kicka/components/ui/button";
import { DrawerClose } from "@kicka/components/ui/drawer";
import { MAX_SCORE } from "@kicka/lib/constants";
import NumberInput from "./number-input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@kicka/components/ui/separator";
import { User } from "./user";
import UserSelect from "./user-select";
import { draftDuoGame } from "@kicka/actions";
import { drawerAtom } from "@kicka/lib/global-state";
import { useAtom } from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import OpponentTeamName from "./opponent-team-name";
import OwnTeamName from "./own-team-name";
import { toast } from "sonner";

const formSchema = z.object({
  teamName: z.string(),
  user1: z.string(),
  user2: z.string(),
  user3: z.string(),
  score1: z.number().int().min(0).max(MAX_SCORE),
  score2: z.number().int().min(0).max(MAX_SCORE),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function Single() {
  const [open, setOpen] = useAtom(drawerAtom);

  const queryClient = useQueryClient();

  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: "",
      score1: 0,
      score2: 0,
      user1: "",
      user2: "",
      user3: "",
    },
  });

  const { handleSubmit, control, setError, getValues, setValue } = methods;

  const { mutate, status } = useMutation({
    mutationFn: draftDuoGame,
    onSuccess: async (res) => {
      if (res.ok) {
        await queryClient.invalidateQueries({
          queryKey: ["matches"],
        });
        toast("Game drafted", {
          description: "Now the other players have to accept the results!",
        });
        setOpen(false);
      } else {
        setError("root", { message: res.message });
      }
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    mutate({
      teamName: data.teamName,
      myScore: data.score1,
      opponentScore: data.score2,
      partner: data.user1,
      opponent1: data.user2,
      opponent2: data.user3,
    });
  });

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col gap-3" onSubmit={onSubmit}>
        <div className="flex flex-row gap-2">
          <OpponentTeamName />
        </div>
        <div className="flex flex-row gap-2">
          <UserSelect control={control} name="user2" />
          <UserSelect control={control} name="user3" />
        </div>
        <div className="flex flex-col items-center gap-4">
          <NumberInput control={control} name="score2" />
          <div className="flex flex-row items-center justify-center gap-2">
            <Separator className="w-12" />
            <span>VS</span>
            <Separator className="w-12" />
          </div>
          <NumberInput control={control} name="score1" />
        </div>
        <div className="flex flex-row gap-2">
          <User />
          <UserSelect control={control} name="user1" />
        </div>
        <div className="flex flex-row gap-2">
          <OwnTeamName control={control} name="teamName" />
        </div>
        <div className="mt-4 flex flex-col gap-2">
          {status === "pending" ? (
            <Button disabled>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button type="submit">Draft</Button>
          )}
          <DrawerClose asChild>
            <Button disabled={status === "pending"} variant="outline">
              Cancel
            </Button>
          </DrawerClose>
          <span className="text-sm text-red-500">
            {methods.formState.errors.root?.message}
          </span>
        </div>
      </form>
    </FormProvider>
  );
}
