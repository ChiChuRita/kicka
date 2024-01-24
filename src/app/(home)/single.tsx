"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UserSelect from "./user-select";

export default function Single() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Single</CardTitle>
        <CardDescription>
          Conquer the rankings in single player mode
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserSelect />
      </CardContent>
    </Card>
  );
}
