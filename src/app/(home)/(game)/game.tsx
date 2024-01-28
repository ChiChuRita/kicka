"use client";

import { useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kicka/components/ui/drawer";

import { Button } from "@kicka/components/ui/button";
import Duo from "./duo";
import { Label } from "@kicka/components/ui/label";
import Single from "./single";
import { Switch } from "@kicka/components/ui/switch";

export default function Game() {
  const [duo, setDuo] = useState(false);

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
            <div className="flex items-center  space-x-2">
              <Label htmlFor="gamemode">Single</Label>
              <Switch onCheckedChange={setDuo} id="gamemode" />
              <Label htmlFor="gamemode">Duo</Label>
            </div>
            {duo ? <Duo /> : <Single />}
          </div>
          <DrawerFooter />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
