import { Rating, TrueSkill, rate_1vs1 } from "ts-trueskill";
import {
  INITIAL_DUO_RATING_MU,
  INITIAL_DUO_RATING_SIGMA,
  INITIAL_SOLO_RATING_MU,
  INITIAL_TEAM_RATING_MU,
  INITIAL_TEAM_RATING_SIGMA,
} from "./constants";

export class SoloRater {
  static rater = new TrueSkill(
    INITIAL_SOLO_RATING_MU,
    INITIAL_DUO_RATING_SIGMA,
    undefined,
    undefined,
    0,
  );

  static rate(args: { winnerRating: Rating; loserRating: Rating }) {
    const [newWinner, newLoser] = rate_1vs1(
      args.winnerRating,
      args.loserRating,
      false,
      undefined,
      this.rater,
    );
    return {
      newWinnerRating: newWinner,
      newLoserRating: newLoser,
    };
  }

  static create(mu?: number, sigma?: number) {
    return this.rater.createRating(mu, sigma);
  }

  static expose(rating: Rating) {
    return this.rater.expose(rating);
  }
}

export class TeamRater {
  static rater = new TrueSkill(
    INITIAL_TEAM_RATING_MU,
    INITIAL_TEAM_RATING_SIGMA,
    undefined,
    undefined,
    0,
  );

  static rate(args: { winnerRating: Rating; loserRating: Rating }) {
    const [newWinner, newLoser] = rate_1vs1(
      args.winnerRating,
      args.loserRating,
      false,
      undefined,
      this.rater,
    );
    return {
      newWinnerRating: newWinner,
      newLoserRating: newLoser,
    };
  }

  static create(mu?: number, sigma?: number) {
    return this.rater.createRating(mu, sigma);
  }

  static expose(rating: Rating) {
    return this.rater.expose(rating);
  }
}

export class DuoRater {
  static rater = new TrueSkill(
    INITIAL_DUO_RATING_MU,
    INITIAL_DUO_RATING_SIGMA,
    undefined,
    undefined,
    0,
  );

  static rate(args: {
    winner0Rating: Rating;
    winner1Rating: Rating;
    loser0Rating: Rating;
    loser1Rating: Rating;
  }) {
    const [[newWinner0, newWinner1], [newLoser0, newLoser1]] = this.rater.rate([
      [args.winner0Rating, args.winner1Rating],
      [args.loser0Rating, args.loser1Rating],
    ]);
    return {
      newWinner0Rating: newWinner0,
      newWinner1Rating: newWinner1,
      newLoser0Rating: newLoser0,
      newLoser1Rating: newLoser1,
    };
  }

  static create(mu?: number, sigma?: number) {
    return this.rater.createRating(mu, sigma);
  }

  static expose(rating: Rating) {
    return this.rater.expose(rating);
  }
}
