import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@kicka/components/ui/alert";

import Dashboard from "./dashboard";
import Header from "@kicka/components/header";
import Link from "next/link";
import Login from "./login";
import { validateRequest } from "@kicka/lib/auth";

export default async function HomePage() {
  const { session } = await validateRequest();
  return (
    <>
      <Header title="Home" />
      <Alert>
        <AlertTitle>🏗️ Oooh you´re very early! 🏗️</AlertTitle>
        <AlertDescription className="flex flex-col">
          This site is still under construction!
          <Link
            className="text-blue-400 underline-offset-4 hover:underline"
            href="/info"
          >
            Get more info here!
          </Link>
        </AlertDescription>
      </Alert>
      {session ? <Dashboard /> : <Login />}
    </>
  );
}
