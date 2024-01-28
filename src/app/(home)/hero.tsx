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

export default async function Hero() {
  const session = await getSession();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome back, {session.user.name}</CardTitle>
        <CardDescription>Enjoy the game 😉</CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar>
          <AvatarImage src={session.user.image} />
          <AvatarFallback>{session.user.name}</AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
}
