"use client";

import { Button } from "@kicka/components/ui/button";
import { DrawerClose } from "@kicka/components/ui/drawer";
import { MAX_SCORE } from "@kicka/lib/constants";
import NumberInput from "./number-input";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Separator } from "@kicka/components/ui/separator";
import { User } from "./user";
import UserSelect from "./user-select";
import { draftSoloGame } from "@kicka/actions";
import { drawerAtom } from "@kicka/lib/global-state";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  user2: z.string(),
  user3: z.string(),
  user4: z.string(),
  score1: z.number().int().min(0).max(MAX_SCORE),
  score2: z.number().int().min(0).max(MAX_SCORE),
});

export type FormSchema = z.infer<typeof formSchema>;

export default function Single() {
  const [open, setOpen] = useAtom(drawerAtom);

  const queryClient = useQueryClient();

  const { handleSubmit, control, register, setError, formState } =
    useForm<FormSchema>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        score1: 0,
        score2: 0,
        user2: "",
        user3: "",
        user4: "",
      },
    });

  const { mutate, status } = useMutation({
    mutationFn: draftSoloGame,
    onSuccess: async (res) => {
      if (res.ok) {
        await queryClient.invalidateQueries({
          queryKey: ["matches"],
        }),
          setOpen(false);
      } else {
        setError("root", { message: res.message });
        console.log(res.message);
      }
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log("Duo not implemented yet");
  });

  return (
    <form className="flex flex-col gap-3" onSubmit={onSubmit}>
      <div className="flex flex-row gap-2">
        <UserSelect control={control} name="user3" />
        <UserSelect control={control} name="user4" />
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
        <UserSelect control={control} name="user2" />
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
        <span className="text-red-500">Just a UI preview!</span>
      </div>
    </form>
  );
}
