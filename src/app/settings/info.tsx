import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kicka/components/ui/card";
import { InfoIcon, Link } from "lucide-react";

import { Button } from "@kicka/components/ui/button";

export default function Info() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <code>Version: 0.0.0-alpha</code>
        <code className="flex flex-row flex-wrap gap-1">
          Feedback:
          <a
            href="mailto:rahul.singh@kickastudent.hpi.de"
            className="text-primary underline-offset-4 hover:cursor-pointer hover:underline"
          >
            rahul.singh@kickastudent.hpi.de
          </a>
        </code>
      </CardContent>
    </Card>
  );
}
