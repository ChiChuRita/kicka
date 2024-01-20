import { getRandomShit } from "@/actions";

export default async function Scoreboard() {
  const randoms = await getRandomShit();

  return (
    <main className="">
      <h1>Scoreboard</h1>
      <code className="flex flex-col">
        {randoms.map((r) => (
          <span>
            {r.email}, {r.name}, {r.elo}
          </span>
        ))}
      </code>
    </main>
  );
}
