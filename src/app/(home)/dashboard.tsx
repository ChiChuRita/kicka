import Games from "./games";
import Hero from "./hero";
import Play from "./(play)/play";

export default async function Dashboard() {
  return (
    <div className="flex w-full flex-col gap-5">
      <Hero />
      <Play />
      <Games />
    </div>
  );
}
