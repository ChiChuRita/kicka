import Header from "@kicka/components/header";

export default async function InfoPage() {
  return (
    <>
      <Header title="Info" />
      <div className="flex flex-col">
        <h4>You are very early!</h4>
        <ul className="flex flex-col">
          <li>
            This is a work in progress. Everything is subject to change. The
            ranking can be reset at any time!
          </li>
          <li>
            Once the first stable version is released, the ranking will be
            permanent.
          </li>
        </ul>
      </div>
      <div className="flex flex-col">
        <h4>Things still missing</h4>
        <ul className="flex flex-col">
          <li>Detail Views</li>
          <li>Game Rules</li>
          <li>Fancy Icons</li>
          <li>Fancy Animations 🧑‍🎨</li>
        </ul>
      </div>
      <div className="flex flex-col">
        <h4>How does the ranking system work?</h4>
        <ul className="flex flex-col">
          <li>
            You need at least 3 games to be ranked in the respected game mode.
          </li>
          <li>
            You need to play at least 1 game every 30 days to be visible in the
            ranking leaderboard.
          </li>
          <li>
            Solo Player ranking is a skill number that reflects you personal
            skill in a 1v1 kicker game. It ranges from about 0-1000.
          </li>
          <li>
            Duo Team ranking is a skill number that reflects the skill of your
            duo team in a 2v2. Every team has its own rating which ranges from
            about 0-1000.
          </li>
          <li>
            Duo Player ranking is a skill number that reflects your personal
            skill in a 2v2 game. It ranges from about 0-100.
          </li>
          <li>
            The rating system to determine every skill number is
            <a
              className="ml-1 text-blue-500  underline-offset-4 hover:underline"
              href="https://www.microsoft.com/en-us/research/wp-content/uploads/2007/01/NIPS2006_0688.pdf"
            >
              TrueSkill™
            </a>
          </li>
          <li>Attend PML there you will learn to implement it 🤓</li>
        </ul>
      </div>
      <div className="flex flex-col">
        <h4 className="mb-2">
          For a fair ranking we need to agree on the kicker game rules
        </h4>
        <ul className="flex flex-col">
          <li>Still working on that.</li>
          <li>They will be here once I am done 🤓</li>
        </ul>
      </div>
    </>
  );
}
