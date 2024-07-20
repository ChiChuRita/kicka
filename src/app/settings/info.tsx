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
      <CardHeader className="p-6 pb-3">
        <CardTitle>Information</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-col">
          <span className="text-muted-foreground">Version</span>
          <span>0.1.1</span>
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground">Feedback</span>
          <a
            className="text-blue-400 underline-offset-4 hover:cursor-pointer hover:underline"
            href="mailto:rahul.singh@kickastudent.hpi.de"
          >
            rahul.singh@student.hpi.de
          </a>
        </div>
        <Link
          href="/info"
          className="text-blue-400 underline-offset-4 hover:cursor-pointer hover:underline"
        >
          More info here
        </Link>
      </CardContent>
    </Card>
  );
}
