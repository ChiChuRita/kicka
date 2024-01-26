import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InfoIcon, Link } from "lucide-react";

export default function Info() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <code>Version: 0.0.0-alpha</code>
        <code className="flex flex-row gap-1">
          Feedback:
          <a
            href="mailto:rahul.singh@student.hpi.de"
            className="text-primary underline-offset-4 hover:cursor-pointer hover:underline"
          >
            rahul.singh@student.hpi.de
          </a>
        </code>
      </CardContent>
    </Card>
  );
}
