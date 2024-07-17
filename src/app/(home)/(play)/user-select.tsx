"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@kicka/components/ui/command";
import {
  FieldValues,
  UseControllerProps,
  useController,
  useFormContext,
  useFormState,
} from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@kicka/components/ui/popover";

import { Button } from "@kicka/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { User } from "@kicka/lib/db/schema";
import { getAllOtherUsers, getAllOtherUsersExcept } from "@kicka/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FormSchema } from "./duo";

export default function UserSelect<FM extends FieldValues>(
  props: UseControllerProps<FM>,
) {
  const { getValues } = useFormContext<FormSchema>();
  const { field } = useController(props);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<User>();

  const allUsers = getValues();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["users", allUsers.user2, allUsers.user3, allUsers.user4],
    queryFn: () =>
      getAllOtherUsersExcept([allUsers.user2, allUsers.user3, allUsers.user4]),
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex flex-row items-center">
            {value && (
              <Avatar className="mr-2 h-6 w-6">
                <AvatarImage src={value.image} />
                <AvatarFallback>{value.username}</AvatarFallback>
              </Avatar>
            )}
            {value ? value.username : "Select user"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {data &&
              data.map((user) => (
                <CommandItem
                  className="h-10"
                  key={user.username}
                  value={user.username}
                  onSelect={async (currentValue) => {
                    await queryClient.refetchQueries({
                      queryKey: ["users"],
                    });
                    field.onChange(user.id);
                    setValue(
                      currentValue === value?.username.toLowerCase()
                        ? undefined
                        : data.find(
                            (user) =>
                              user.username.toLowerCase() === currentValue,
                          ),
                    );
                    setOpen(false);
                  }}
                >
                  <Avatar className="mr-2 h-6 w-6">
                    <AvatarImage src={user.image} />
                    <AvatarFallback>{user.username}</AvatarFallback>
                  </Avatar>
                  {user.username}
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
