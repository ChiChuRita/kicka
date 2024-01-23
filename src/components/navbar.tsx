"use client";

import Link from "next/link";
import { Button } from "./ui/button";

import { usePathname } from "next/navigation";

export default function Navbar() {
  const currentPath = usePathname();

  return (
    <nav className="fixed bottom-0 flex w-full justify-center gap-5 rounded-t-3xl border-x border-t p-4">
      <Link href="/scoreboard">
        <Button
          variant={currentPath === "/scoreboard" ? "destructive" : "secondary"}
        >
          Scoreboard
        </Button>
      </Link>
      <Link href="/">
        <Button variant={currentPath === "/" ? "destructive" : "secondary"}>
          Home
        </Button>
      </Link>
      <Link href="/settings">
        <Button
          variant={currentPath === "/settings" ? "destructive" : "secondary"}
        >
          Settings
        </Button>
      </Link>
    </nav>
  );
}
