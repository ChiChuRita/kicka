"use client";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@kicka/components/ui/drawer";

import { Button } from "@kicka/components/ui/button";
import Duo from "./duo";
import { Label } from "@kicka/components/ui/label";
import Solo from "./solo";
import { Switch } from "@kicka/components/ui/switch";
import { drawerAtom } from "@kicka/lib/global-state";
import { useAtom } from "jotai";
import { useState } from "react";

export default function Play() {
  const [duo, setDuo] = useState(false);
  const [open, setOpen] = useAtom(drawerAtom);

  return (
    <Drawer
      open={open}
      direction="top"
      onOpenChange={(t) => {
        setOpen(t);
      }}
    >
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="h-10"
          onClick={() => setOpen(true)}
        >
          Play
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Play</DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-5 px-4">
            <div className="flex items-center  space-x-2">
              <Label htmlFor="gamemode">Solo</Label>
              <Switch onCheckedChange={setDuo} id="gamemode" />
              <Label htmlFor="gamemode">Duo</Label>
            </div>
            {duo ? <Duo /> : <Solo />}
          </div>
          <DrawerFooter />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
