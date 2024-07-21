import { TeamRater } from "@kicka/lib/skill";

function gamma(shape: number, scale = 1): number {
  if (shape < 1) {
    // Special case for shape < 1 (improved accuracy)
    return gamma(shape + 1, scale) * Math.pow(Math.random(), 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    const x = normal(); // Sample from standard normal distribution
    const v = Math.pow(1 + c * x, 3);
    const u = Math.random();

    if (u < 1 - 0.0331 * x * x * x * x) {
      return d * v * scale; // Accept the sample
    }

    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v * scale; // Accept the sample
    }
  }
}

function gammaSample(shape: number, scale = 1, length: number) {
  const gamma_values = new Array(1000)
    .fill(0)
    .map(() => gamma(shape, scale))
    .sort((a, b) => a - b);

  const max = Math.max(...gamma_values);

  const normalized_gamma_values = gamma_values.map((value) => value / max);
  const index_values = normalized_gamma_values.map((value) =>
    Math.floor(value * (length - 1)),
  );
  return index_values[Math.floor(Math.random() * index_values.length)];
}

function normal(mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

class Player {
  constructor(
    public rating = TeamRater.create(),
    public skill = Math.floor(normal(50, 15)),
    public games = 0,
    public wins = 0,
    public performanceLog: number[] = [],
  ) {}

  static play(player0: Player, player1: Player) {
    const performance0 = normal(player0.skill, 20);
    const performance1 = normal(player1.skill, 20);

    player0.performanceLog.push(performance0);
    player1.performanceLog.push(performance1);

    let loser = performance0 < performance1 ? player0 : player1;
    let winner = performance0 < performance1 ? player1 : player0;

    const { newWinnerRating, newLoserRating } = TeamRater.rate({
      winnerRating: winner.rating,
      loserRating: loser.rating,
    });

    winner.rating = newWinnerRating;
    loser.rating = newLoserRating;

    winner.games++;
    loser.games++;
    winner.wins++;
  }

  toString() {
    return `Skill: ${this.skill}, Games: ${this.games}, Wins: ${this.wins}, Rating: ${Math.round(TeamRater.expose(this.rating))}`;
  }
}
const realSkill = new Array(100).fill(0).map(() => new Player());

//pick two random players and play them
realSkill.sort((p1, p2) => p2.skill - p1.skill);

for (let i = 0; i < 500; i++) {
  const player1 = realSkill[gammaSample(2, 2, realSkill.length)];
  const player2 = realSkill[gammaSample(2, 2, realSkill.length)];
  if (player1 === player2) {
    continue;
  }
  Player.play(player1, player2);
}
console.log(
  realSkill
    .sort((p1, p2) => TeamRater.expose(p2.rating) - TeamRater.expose(p1.rating))
    // .sort((p1, p2) => p2.skill - p1.skill)
    .map((player) => player.toString())
    .join("\n"),
);
// console.log(
//   realSkill
//     .sort((p1, p2) => TeamRater.expose(p2.rating) - TeamRater.expose(p1.rating))
//     .map((player) => player.performanceLog)[0],
// );
