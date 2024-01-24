"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Single from "./single";
import Duo from "./duo";

export default function Game() {
  return (
    <Tabs defaultValue="single">
      <TabsList className="grid w-36 grid-cols-2">
        <TabsTrigger value="single">Single</TabsTrigger>
        <TabsTrigger value="duo">Duo</TabsTrigger>
      </TabsList>
      <TabsContent value="single">
        <Single />
      </TabsContent>
      <TabsContent value="duo">
        <Duo />
      </TabsContent>
    </Tabs>
  );
}
