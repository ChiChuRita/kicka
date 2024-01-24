import { getAllUsers, getUserByName } from "@/actions";
import Game from "./game";
import Hero from "./hero";

export default async function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-5">
      <Hero />
      <Game />
    </div>
  );
}
