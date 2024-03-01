"use client";

import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@kicka/components/ui/drawer";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kicka/components/ui/tabs";

import { Button } from "@kicka/components/ui/button";
import Duo from "./duo";
import Solo from "./solo";
import { drawerAtom } from "@kicka/lib/global-state";
import { useAtom } from "jotai";

export default function Play() {
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
        <Tabs
          defaultValue="solo"
          className="mx-auto flex max-w-md flex-col gap-4 p-8"
        >
          <TabsList>
            <TabsTrigger className="w-full" value="solo">
              Solo
            </TabsTrigger>
            <TabsTrigger className="w-full" value="duo">
              Duo
            </TabsTrigger>
          </TabsList>
          <TabsContent value="solo">
            <Solo />
          </TabsContent>
          <TabsContent value="duo">
            <Duo />
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}
