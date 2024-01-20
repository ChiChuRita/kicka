import Link from "next/link";
import { useProtect } from "../protect";

export default function Settings() {
  const session = useProtect();

  return (
    <main className="">
      <h1>Settings</h1>
      <Link href="/api/auth/signout">Logout</Link>
    </main>
  );
}
