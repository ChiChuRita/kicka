import { Rating, rate_1vs1 } from "ts-trueskill";
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
