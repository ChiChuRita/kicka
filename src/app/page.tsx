import { addRandomShit } from "@/actions";
import { useProtect } from "./protect";

export default async function Home() {
  const session = await useProtect();

  return (
    <main className="">
      <h1>HPI Kicka</h1>
      <img src={session.user?.image || "logo.svg"} alt="image of user" />
    </main>
  );
}
