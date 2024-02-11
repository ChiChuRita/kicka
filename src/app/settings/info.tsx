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
      <CardHeader className="">
        <CardTitle>Information</CardTitle>
        <CardDescription>Information about the game</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <code>Version: 0.0.0-alpha</code>
        <code className="flex flex-row flex-wrap gap-1">
          Feedback:
          <a
            href="mailto:rahul.singh@kickastudent.hpi.de"
            className="text-wrap text-blue-400 text-primary underline-offset-4 hover:cursor-pointer hover:underline"
          >
            rahul.singh@student.hpi.de
          </a>
        </code>
        <Link href="/info">
          <code className="text-wrap text-blue-400 text-primary underline-offset-4 hover:cursor-pointer hover:underline">
            More info here
          </code>
        </Link>
      </CardContent>
    </Card>
  );
}
