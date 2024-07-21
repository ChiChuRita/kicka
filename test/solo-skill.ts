import { TeamRater } from "@kicka/lib/skill";

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
for (let i = 0; i < 1_000; i++) {
  const player1 = realSkill[Math.floor(Math.random() * realSkill.length)];
  const player2 = realSkill[Math.floor(Math.random() * realSkill.length)];
  Player.play(player1, player2);
}
console.log(
  realSkill
    .sort((p1, p2) => TeamRater.expose(p2.rating) - TeamRater.expose(p1.rating))
    .map((player) => player.toString())
    .join("\n"),
);
console.log(
  realSkill
    .sort((p1, p2) => TeamRater.expose(p2.rating) - TeamRater.expose(p1.rating))
    .map((player) => player.performanceLog)[0],
);
