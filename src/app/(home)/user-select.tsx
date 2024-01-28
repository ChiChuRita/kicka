"use client";

import * as React from "react";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Avatar } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { User } from "@/db/schema";
import { getAllUsersExcept } from "@/actions";
import { useSession } from "next-auth/react";

export default function UserSelect() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState<User | null>();
  const [users, setUsers] = React.useState<User[]>([]);
  const { data: session } = useSession();

  React.useEffect(() => {
    const getData = async () => {
      const users = await getAllUsersExcept(session?.user?.email || "");
      setUsers(users);
    };

    getData().catch(console.error);
  }, [session?.user?.email]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between "
        >
          <div className="flex flex-row items-center">
            <Avatar>
              <AvatarImage
                className="mr-2 h-4 w-4 rounded-full"
                src={value?.image}
              />
              <AvatarFallback>{value?.name}</AvatarFallback>
            </Avatar>
            {value ? value.name : "Select user"}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search user..." />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {users.map((user) => (
              <CommandItem
                key={user.name}
                value={user.name}
                onSelect={(currentValue) => {
                  setValue(
                    currentValue === value?.name.toLowerCase()
                      ? null
                      : users.find(
                          (user) => user.name.toLowerCase() === currentValue,
                        ),
                  );
                  setOpen(false);
                }}
              >
                <Avatar>
                  <AvatarImage
                    className="mr-2 h-4 w-4 rounded-full"
                    src={user.image}
                  />
                  <AvatarFallback>{user.name}</AvatarFallback>
                </Avatar>
                {user.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
