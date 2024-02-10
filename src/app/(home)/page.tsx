import Dashboard from "./dashboard";
import Header from "@kicka/components/Header";
import Image from "next/image";
import Login from "./login";
import { getUnsafeSession } from "@kicka/lib/get-session";

export default async function HomePage() {
  const session = await getUnsafeSession();

  return (
    <>
      <Header title="Home" />
      {session ? <Dashboard /> : <Login />}
    </>
  );
}
