import { getSession } from "@/lib/get-session";

export default async function Dashboard() {
  const session = await getSession();

  return (
    <div>
      <h2>Welcome back, {session!.user?.name}</h2>
      <img src={session!.user?.image || "logo.svg"} alt="image of user" />
    </div>
  );
}
