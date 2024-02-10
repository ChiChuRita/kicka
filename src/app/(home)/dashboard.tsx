import Hero from "./hero";
import Matches from "./matches";
import Play from "./(play)/play";

export default async function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-5">
      <Hero />
      <Play />
      <Matches />
    </div>
  );
}
