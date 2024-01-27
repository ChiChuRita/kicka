"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@radix-ui/react-label";

import Duo from "./duo";
import Single from "./single";

export default function Game() {
  const [duo, setDuo] = React.useState(false);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" className="h-10">
          Play
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader></DrawerHeader>
          <div className="flex flex-col gap-5 px-4">
            <div className="flex items-center justify-center space-x-2">
              <Label htmlFor="gamemode">Single</Label>
              <Switch onCheckedChange={setDuo} id="gamemode" />
              <Label htmlFor="gamemode">Duo</Label>
            </div>
            {duo ? <Single /> : <Duo />}
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
