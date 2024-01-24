import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import { redirect } from "next/navigation";

export async function getSession() {
  const session = await getServerSession(authOptions);

  if (!session) return redirect("/");

  return session;
}
