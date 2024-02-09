import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@kicka/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@kicka/components/ui/card";

import { getSession } from "@kicka/lib/get-session";
import { getSolo } from "@kicka/actions";

export default async function Hero() {
  const session = await getSession();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome {session.user.name}!</CardTitle>
        <CardDescription>Enjoy the game 😉</CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>{session.user.name}</AvatarFallback>
        </Avatar>
        <span>
          {JSON.stringify(await getSolo(session.user.email), null, 2)}
        </span>
      </CardContent>
    </Card>
  );
}
