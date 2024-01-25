"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";
import UserSelect from "./user-select";

export default function Game() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="h-10">
          Play
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Play</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-5 px-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="gamemode">Single</Label>
              <Switch id="gamemode" />
              <Label htmlFor="gamemode">Duo</Label>
            </div>
            <UserSelect />
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button>Draft</Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
