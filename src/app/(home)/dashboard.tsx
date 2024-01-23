import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/get-session";

export default async function Dashboard() {
  const session = await getSession();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Welcome back, {session!.user?.name}</CardTitle>
        <CardDescription>Enjoy the game 😉</CardDescription>
      </CardHeader>
      <CardContent>
        <Avatar>
          <AvatarImage
            src={session!.user?.image ? session?.user.image : undefined}
          />
          <AvatarFallback>{session!.user?.name}</AvatarFallback>
        </Avatar>
      </CardContent>
    </Card>
  );
}
