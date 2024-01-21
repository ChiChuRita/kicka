import Link from "next/link";
import { Button } from "./button";

export default function Navbar() {
  return (
    <nav className="container flex justify-center gap-5 bg-slate-100 p-4 rounded-t-3xl">
      <Link href="/scoreboard">
        <Button>Scoreboard</Button>
      </Link>
      <Link href="/">
        <Button>Home</Button>
      </Link>
      <Link href="/settings">
        <Button>Settings</Button>
      </Link>
    </nav>
  );
}
