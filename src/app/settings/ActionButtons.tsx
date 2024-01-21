"use client";
import { deleteUser } from "@/actions";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function ActionButtons() {
  return (
    <div>
      <Button
        variant={"secondary"}
        onClick={() => {
          signOut({ redirect: true, callbackUrl: "/" });
        }}
      >
        Logout
      </Button>
      <Button
        variant={"destructive"}
        onClick={() => {
          signOut({ redirect: true, callbackUrl: "/" });
          deleteUser();
        }}
      >
        Delete Account
      </Button>
    </div>
  );
}
