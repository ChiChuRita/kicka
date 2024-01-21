import Login from "./login";
import Dashboard from "./dashboard";
import { getSession } from "@/lib/get-session";

export default async function HomePage() {
  const session = await getSession();

  return (
    <div>
      <h1>HPI Kicka</h1>
      {session ? <Dashboard /> : <Login />}
    </div>
  );
}
