import Link from "next/link";
import { Protect } from "../Protect";

export default function Settings() {
  return Protect(
    <main className="">
      <h1>Settings</h1>
      <Link href="/api/auth/signout">Logout</Link>
    </main>
  );
}
