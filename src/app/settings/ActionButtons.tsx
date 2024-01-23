import { deleteUser } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "next-auth/react";

export default function ActionButtons() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-3">
        <Button
          variant={"secondary"}
          onClick={() => {
            signOut();
          }}
        >
          Logout
        </Button>
        <Button
          variant={"destructive"}
          onClick={() => {
            signOut();
            deleteUser();
          }}
        >
          Delete Account
        </Button>
      </CardContent>
    </Card>
  );
}
