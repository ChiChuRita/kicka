"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const currentPath = usePathname();

  return (
    <nav className="fixed bottom-0 flex w-full max-w-2xl justify-center gap-5 rounded-t-3xl border-x border-t bg-background p-5">
      <Link href="/rankings">
        <Button
          variant={currentPath === "/rankings" ? "destructive" : "secondary"}
        >
          Rankings
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
