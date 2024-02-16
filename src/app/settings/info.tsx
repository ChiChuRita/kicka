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
      <CardContent className="flex flex-col gap-1">
        <code>Version: 0.0.0-alpha</code>
        <code className="flex flex-col">
          Feedback:
          <a
            className="text-wrap text-blue-500 text-primary underline-offset-4 hover:cursor-pointer hover:underline"
            href="mailto:rahul.singh@kickastudent.hpi.de"
          >
            rahul.singh@student.hpi.de
          </a>
        </code>
        <Link href="/info">
          <code className="text-wrap text-blue-500 text-primary underline-offset-4 hover:cursor-pointer hover:underline">
            More info here
          </code>
        </Link>
      </CardContent>
    </Card>
  );
}
