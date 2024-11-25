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
    // Calculate total performance for each team
    const getTeamPerformance = (team: Team) => 
        normal(team.skill0, 20) + normal(team.skill1, 20);
    
    const performance0 = getTeamPerformance(team0);
    const performance1 = getTeamPerformance(team1);

    // Determine winner and loser based on performance
    const [winner, loser] = performance0 > performance1 
        ? [team0, team1] 
        : [team1, team0];

    // Update ratings
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

    // Apply new ratings
    Object.assign(winner, {
        rating0: newWinner0Rating,
        rating1: newWinner1Rating,
        games: winner.games + 1,
        wins: winner.wins + 1
    });

    Object.assign(loser, {
        rating0: newLoser0Rating,
        rating1: newLoser1Rating,
        games: loser.games + 1
    });
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

