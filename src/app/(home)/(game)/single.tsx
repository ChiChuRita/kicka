"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kicka/components/ui/card";

import { Button } from "@kicka/components/ui/button";
import UserSelect from "./user-select";
import { useSession } from "next-auth/react";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useForm } from "@tanstack/react-form";
import { Input } from "@kicka/components/ui/input";
import { z } from "zod";
import { DrawerClose } from "@kicka/components/ui/drawer";

export function User() {
  const { data: session, status } = useSession();

  return status === "authenticated" ? (
    <Button variant="outline" className="justify-start">
      <Avatar className="mr-2 h-4 w-4">
        <AvatarImage src={session.user?.image!} />
        <AvatarFallback>{session.user?.name}</AvatarFallback>
      </Avatar>
      <span>{session.user?.name}</span>
    </Button>
  ) : null;
}
export default function Single() {
  const { Field, Provider, handleSubmit } = useForm({
    defaultValues: {
      num1: 0,
      num2: 0,
    },

    onSubmit: (values) => {
      console.log("TROLL");
    },

    validatorAdapter: zodValidator,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Single</CardTitle>
        <CardDescription>Play against one opponent</CardDescription>
      </CardHeader>
      <CardContent>
        <Provider>
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <UserSelect />
            <div className="flex flex-row justify-between gap-2">
              <Field
                name="num1"
                validators={{ onChange: z.number().min(0).max(30) }}
                children={(field) => (
                  <div className="flex flex-row">
                    <Button
                      variant="outline"
                      className="h-10 w-10 rounded-none rounded-l border-r-0"
                      onClick={() => field.setValue((v) => v - 1)}
                    >
                      -1
                    </Button>
                    <Input
                      className="flex w-12 rounded-none text-center"
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number.parseInt(e.target.value))
                      }
                    />
                    <Button
                      className="h-10 w-10 rounded-none rounded-r border-l-0"
                      variant="outline"
                      onClick={() => field.setValue((v) => v + 1)}
                    >
                      +1
                    </Button>
                  </div>
                )}
              />
              <Field
                name="num2"
                validators={{ onChange: z.number().min(0).max(30) }}
                children={(field) => (
                  <div className="flex flex-row">
                    <Button
                      variant="outline"
                      className="h-10 w-10 rounded-none rounded-l border-r-0"
                      onClick={() => field.setValue((v) => v - 1)}
                    >
                      -1
                    </Button>
                    <Input
                      className="flex w-12 rounded-none text-center"
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(Number.parseInt(e.target.value))
                      }
                    />
                    <Button
                      className="h-10 w-10 rounded-none rounded-r border-l-0"
                      variant="outline"
                      onClick={() => field.setValue((v) => v + 1)}
                    >
                      +1
                    </Button>
                  </div>
                )}
              />
            </div>
            <User />
            <DrawerClose asChild>
              <Button>Draft</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </form>
        </Provider>
      </CardContent>
    </Card>
  );
}
