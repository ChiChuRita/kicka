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

import { getSession } from "@kicka/actions/auth";

export default async function Hero() {
  const { user } = await getSession();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome {user.username}!</CardTitle>
        <CardDescription>Enjoy the game 😉</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Avatar>
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.username}</AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
}
