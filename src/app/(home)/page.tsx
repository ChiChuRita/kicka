import Login from "./login";
import Dashboard from "./dashboard";
import { getUnsafeSession } from "@/lib/get-session";
import Image from "next/image";

export default async function HomePage() {
  const session = await getUnsafeSession();

  return (
    <>
      <Image src="/logo.svg" alt="kicka logo" width={100} height={100} />
      {session ? <Dashboard /> : <Login />}
    </>
  );
}
