"use client";

import { set, z } from "zod";

import { Button } from "@kicka/components/ui/button";
import { Card } from "@kicka/components/ui/card";
import { DrawerClose } from "@kicka/components/ui/drawer";
import { Input } from "@kicka/components/ui/input";
import { MAX_SCORE } from "@kicka/lib/constants";
import NumberInput from "./number-input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { User } from "./user";
import UserSelect from "./user-select";
import { draftSoloGame } from "@kicka/actions";
import { drawerAtom } from "@kicka/lib/global-state";
import { useAction } from "next-safe-action/hooks";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  user2: z.string().email(),
  score1: z.number().int().min(0).max(MAX_SCORE),
  score2: z.number().int().min(0).max(MAX_SCORE),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function Single() {
  const [open, setOpen] = useAtom(drawerAtom);

  const { handleSubmit, control, register, setError, formState } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      score1: 0,
      score2: 0,
      user2: "",
    },
  });

  const { execute, status } = useAction(draftSoloGame, {
    onSuccess: () => setOpen(false),
  });

  const onSubmit = handleSubmit(async (data) => {
    execute({
      opponent: data.user2,
      myScore: data.score1,
      opponentScore: data.score2,
    });
  });

  return (
    <Card className="flex flex-col gap-2 border-none">
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <User />
        <NumberInput control={control} name="score1" />
        <NumberInput control={control} name="score2" />
        <UserSelect control={control} name="user2" />
        {status === "executing" ? (
          <Button disabled>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </Button>
        ) : (
          <Button type="submit">Draft</Button>
        )}
        {formState.errors && <span>{JSON.stringify(formState.errors)}</span>}
        <DrawerClose asChild>
          <Button disabled={status === "executing"} variant="outline">
            Cancel
          </Button>
        </DrawerClose>
      </form>
    </Card>
  );
}
