import { db } from "@/db";

export const revalidate = 0;

export default async function Scoreboard() {
  const randoms = await db.query.users.findMany();

  return (
    <main className="">
      <h1>Scoreboard</h1>
      <code className="flex flex-col">
        {randoms.map((r, i) => (
          <div className="flex flex-row" key={i}>
            <img width={32} height={32} src={r.image || ""} />
            <span>{r.name}</span>
          </div>
        ))}
      </code>
    </main>
  );
}
