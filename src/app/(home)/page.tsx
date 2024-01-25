import Login from "./login";
import Dashboard from "./dashboard";
import { getUnsafeSession } from "@/lib/get-session";

export default async function HomePage() {
  const session = await getUnsafeSession();

  return (
    <>
      <h1>HPI Kicka</h1>
      {session ? <Dashboard /> : <Login />}
    </>
  );
}
