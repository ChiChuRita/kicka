import { DuoRater } from "@kicka/lib/skill";

function normal(mean = 0, stdev = 1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return z * stdev + mean;
}

class Team {
  constructor(
    public rating0 = DuoRater.create(),
    public rating1 = DuoRater.create(),
    public skill0 = Math.floor(normal(50, 15)),
    public skill1 = Math.floor(normal(50, 15)),
    public games = 0,
    public wins = 0,
  ) {}

  static play(team0: Team, team1: Team) {
    const performance0 = normal(team0.skill0, 20) + normal(team0.skill1, 20);
    const performance1 = normal(team1.skill0, 20) + normal(team1.skill1, 20);

    let loser = performance0 < performance1 ? team0 : team1;
    let winner = performance0 < performance1 ? team1 : team0;

    const {
      newWinner0Rating,
      newWinner1Rating,
      newLoser0Rating,
      newLoser1Rating,
    } = DuoRater.rate({
      winner0Rating: winner.rating0,
      winner1Rating: winner.rating1,
      loser0Rating: loser.rating0,
      loser1Rating: loser.rating1,
    });

    winner.rating0 = newWinner0Rating;
    winner.rating1 = newWinner1Rating;
    loser.rating0 = newLoser0Rating;
    loser.rating1 = newLoser1Rating;

    winner.games++;
    loser.games++;
    winner.wins++;
  }

  toString() {
    return `Skill: ${this.skill0}, ${this.skill1}, Games: ${this.games}, Wins: ${this.wins}, Rating: ${Math.round(DuoRater.expose(this.rating0))}, ${Math.round(DuoRater.expose(this.rating1))}`;
  }
}
const realSkill = new Array(100).fill(0).map(() => new Team());

//pick two random players and play them
for (let i = 0; i < 1_000; i++) {
  const player1 = realSkill[Math.floor(Math.random() * realSkill.length)];
  const player2 = realSkill[Math.floor(Math.random() * realSkill.length)];
  Team.play(player1, player2);
}
console.log(
  realSkill
    .sort((p1, p2) => DuoRater.expose(p2.rating0) - DuoRater.expose(p1.rating0))
    .map((player) => player.toString())
    .join("\n"),
);
