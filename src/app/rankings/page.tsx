"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kicka/components/ui/tabs";

import Header from "@kicka/components/header";

export default function Rankings() {
  return (
    <>
      <Header title="Rankings" />
      <Tabs defaultValue="solo">
        <TabsList className="flex w-36 flex-row">
          <TabsTrigger className="w-full" value="solo">
            Solo
          </TabsTrigger>
          <TabsTrigger className="w-full" value="duo">
            Duo
          </TabsTrigger>
        </TabsList>
        <TabsContent value="solo">Here are the solo rankings.</TabsContent>
        <TabsContent value="duo">Here are the duo rankings.</TabsContent>
      </Tabs>
    </>
  );
}
