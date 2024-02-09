import { Rating, quality, rate_1vs1 } from "ts-trueskill";

const players = 50;
const initial = 500;

const teams = new Array(players).fill(new Rating(initial));
const plays = new Array(players).fill(0);

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

for (let i = 0; i < 250; ++i) {
  const num1 = getRandomInt(players);
  const num2 = getRandomInt(players);

  if (num1 === num2) continue;

  const team1 = Math.min(num1, num2);
  const team2 = Math.max(num1, num2);

  const [nt1, nt2] = rate_1vs1(teams[team1], teams[team2]);
  teams[team1] = nt1;
  teams[team2] = nt2;
  plays[team1]++;
  plays[team2]++;
  if (num1 === -1) {
    console.log(num1 < num2 ? "win" : "lose");
    console.log(teams[num1].mu, teams[num2].mu);
  }
}
console.log(teams.map((t, i) => (plays[i] > 3 ? t.mu : t.mu)));

console.log(new Rating(500).toString());
