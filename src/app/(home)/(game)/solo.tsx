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
import { Minus, Plus } from "lucide-react";

const MAX_NUM = 30;

export function User() {
  const { data: session, status } = useSession();

  return status === "authenticated" ? (
    <Button variant="outline" className="w-full justify-start">
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

    onSubmit: (values) => {},

    validatorAdapter: zodValidator,
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Solo</CardTitle>
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
                validators={{ onChange: z.number().min(0).max(MAX_NUM) }}
                children={(field) => (
                  <div className="flex flex-row">
                    <Button
                      variant="outline"
                      className="h-10 w-10 rounded-none rounded-l border-r-0 p-3"
                      onClick={() => field.setValue((v) => (v > 0 ? v - 1 : v))}
                    >
                      <Minus />
                    </Button>
                    <Input
                      className="z-10 flex w-12 rounded-none text-center hover:outline-none"
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        try {
                          let num = Number.parseInt(e.target.value);
                          if (num < 0) {
                            num = 0;
                          } else if (num > MAX_NUM) {
                            num = MAX_NUM;
                          }
                          field.handleChange(num);
                        } catch {
                          field.handleChange(0);
                        }
                      }}
                    />
                    <Button
                      className="h-10 w-10 rounded-none rounded-r border-l-0 p-3"
                      variant="outline"
                      onClick={() =>
                        field.setValue((v) => (v < MAX_NUM ? v + 1 : v))
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                )}
              />
              <Field
                name="num2"
                validators={{ onChange: z.number().min(0).max(MAX_NUM) }}
                children={(field) => (
                  <div className="flex flex-row">
                    <Button
                      variant="outline"
                      className="h-10 w-10 rounded-none rounded-l border-r-0 p-3 "
                      onClick={() => field.setValue((v) => (v > 0 ? v - 1 : v))}
                    >
                      <Minus />
                    </Button>
                    <Input
                      className="z-10 flex w-12 rounded-none text-center"
                      type="number"
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        try {
                          let num = Number.parseInt(e.target.value);
                          if (num < 0) {
                            num = 0;
                          } else if (num > MAX_NUM) {
                            num = MAX_NUM;
                          }
                          field.handleChange(num);
                        } catch {
                          field.handleChange(0);
                        }
                      }}
                    />
                    <Button
                      className="h-10 w-10 rounded-none rounded-r border-l-0 p-3"
                      variant="outline"
                      onClick={() =>
                        field.setValue((v) => (v < MAX_NUM ? v + 1 : v))
                      }
                    >
                      <Plus />
                    </Button>
                  </div>
                )}
              />
            </div>
            <User />
            <DrawerClose asChild>
              <Button type="submit">Draft</Button>
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
