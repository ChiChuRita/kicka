import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email: text("email").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image").notNull(),
});

export type User = typeof users.$inferSelect;

export const single = pgTable("single", {
  elo: integer("elo").default(0).notNull(),
  user: text("user").references(() => users.email),
});

export const duo = pgTable("duo", {
  elo: integer("elo").default(0).notNull(),
  user1: text("user_1").references(() => users.email),
  user2: text("user_2").references(() => users.email),
});

export const singleMatches = pgTable("single_matches", {
  id: integer("id").primaryKey(),
  winnerElo: integer("winner_elo").notNull(),
  loserElo: integer("loser_elo").notNull(),
  date: text("date").notNull(),
});

export const duoMatches = pgTable("duo_matches", {
  id: integer("id").primaryKey(),
  winner1: text("winner_1").references(() => users.email),
  winner2: text("winner_2").references(() => users.email),
  loser1: text("loser_1").references(() => users.email),
  loser2: text("loser_2").references(() => users.email),
  winnerElo: integer("winner_elo").notNull(),
  loserElo: integer("loser_elo").notNull(),
  date: text("date").notNull(),
});
