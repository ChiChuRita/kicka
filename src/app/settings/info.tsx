import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kicka/components/ui/card";

import Link from "next/link";

export default function Info() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Information</CardTitle>
        <CardDescription>Information about the game</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <code className="flex flex-col">
          <span>Version</span>
          <span>0.0.0-alpha</span>
        </code>
        <code className="flex flex-col">
          Feedback
          <a
            className="text-blue-400 underline-offset-4 hover:cursor-pointer hover:underline"
            href="mailto:rahul.singh@kickastudent.hpi.de"
          >
            rahul.singh@student.hpi.de
          </a>
        </code>
        <Link href="/info">
          <code className="text-blue-400 underline-offset-4 hover:cursor-pointer hover:underline">
            More info here
          </code>
        </Link>
      </CardContent>
    </Card>
  );
}
