import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email: text("email").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image").notNull(),
});

export type User = typeof users.$inferSelect;

export const solo = pgTable("solo", {
  elo: integer("elo").default(0).notNull(),
  user: text("user")
    .notNull()
    .references(() => users.email),
});

export const duo = pgTable("duo", {
  elo: integer("elo").default(0).notNull(),
  name: text("name").notNull().unique(),
  user1: text("user_1")
    .notNull()
    .references(() => users.email),
  user2: text("user_2")
    .notNull()
    .references(() => users.email),
});

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
