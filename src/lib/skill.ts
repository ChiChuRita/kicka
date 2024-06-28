import { Rating, rate_1vs1, rate as rater } from "ts-trueskill";
import { INITIAL_RATING_MU, INITIAL_RATING_SIGMA } from "./constants";

export class KickaRating {
  constructor(
    public mu: number,
    public sigma: number,
  ) {}

  static fromRating(rating: Rating) {
    return new KickaRating(rating.mu, rating.sigma);
  }

  toRating() {
    return new Rating(this.mu, this.sigma);
  }
}

export function rate(args: {
  winnerRating: KickaRating;
  loserRating: KickaRating;
}) {
  const [newWinner, newLoser] = rate_1vs1(
    args.winnerRating.toRating(),
    args.loserRating.toRating(),
  );
  return {
    newWinnerRating: KickaRating.fromRating(newWinner),
    newLoserRating: KickaRating.fromRating(newLoser),
  };
}

//TO BE TESTED
export function rateDuoPlayer(args: {
  winner0Rating: KickaRating;
  winner1Rating: KickaRating;
  loser0Rating: KickaRating;
  loser1Rating: KickaRating;
}) {
  const [[newWinner0, newWinner1], [newLoser0, newLoser1]] = rater(
    [args.winner0Rating.toRating(), args.winner1Rating.toRating()],
    [args.loser0Rating.toRating(), args.loser1Rating.toRating()],
  );
  return {
    newWinner0Rating: KickaRating.fromRating(newWinner0),
    newWinner1Rating: KickaRating.fromRating(newWinner1),
    newLoser0Rating: KickaRating.fromRating(newLoser0),
    newLoser1Rating: KickaRating.fromRating(newLoser1),
  };
}

export function initialSoloRating() {
  return new KickaRating(INITIAL_RATING_MU, INITIAL_RATING_SIGMA);
}

export function initialTeamRating() {
  return new KickaRating(INITIAL_RATING_MU, INITIAL_RATING_SIGMA);
}

//This rating is more for the flex
export function initialDuoRating() {
  return KickaRating.fromRating(new Rating());
}
