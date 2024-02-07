import { integer, pgTable, text, timestamp, unique } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email: text("email").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image").notNull(),
});

export type User = typeof users.$inferSelect;

export const solo = pgTable("solo", {
  elo: integer("elo").default(0).notNull(),
  wins: integer("wins").default(0).notNull(),
  games: integer("games").default(0).notNull(),
  user: text("user")
    .primaryKey()
    .references(() => users.email),
});

export const duo = pgTable(
  "duo",
  {
    elo: integer("elo").default(0).notNull(),
    name: text("name").notNull().unique(),
    wins: integer("wins").default(0).notNull(),
    games: integer("games").default(0).notNull(),
    user1: text("user_1").references(() => users.email),
    user2: text("user_2").references(() => users.email),
  },
  (t) => ({
    unq: unique().on(t.name, t.user1, t.user2),
  }),
);

export const soloMatches = pgTable("solo_matches", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  player1: text("player_1")
    .notNull()
    .references(() => users.email),
  player2: text("player_2")
    .notNull()
    .references(() => users.email),
  winner: integer("winner").notNull(),
  date: timestamp("date").notNull(),
});
