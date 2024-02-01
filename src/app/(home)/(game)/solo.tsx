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
import { draftSoloGame } from "@kicka/actions";

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
  return (
    <Card className="flex flex-col gap-2 border-none">
      <User />
      <DrawerClose asChild>
        <Button type="submit">Draft</Button>
      </DrawerClose>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </Card>
  );
}
