import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
  email: text("email").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastOnlineAt: timestamp("last_online_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type User = typeof users.$inferSelect;

export const usersRelation = relations(users, ({ one }) => ({
  solo: one(solo),
}));

export type Solo = typeof solo.$inferSelect;

export const solo = pgTable("solo", {
  user: text("user")
    .primaryKey()
    .references(() => users.email, { onDelete: "cascade" }),
  skill_mu: doublePrecision("skill_mu").notNull(),
  skill_sigma: doublePrecision("skill_sigma").notNull(),
  wins: integer("wins").default(0).notNull(),
  games: integer("games").default(0).notNull(),
});

export const soloRelations = relations(solo, ({ one }) => ({
  user: one(users, {
    fields: [solo.user],
    references: [users.email],
  }),
}));

export type DuoMatch = typeof duo.$inferSelect;

export const duo = pgTable(
  "duo",
  {
    name: text("name").notNull().unique(),
    skillMu: doublePrecision("skill_mu").notNull(),
    skillSigma: doublePrecision("skill_sigma").notNull(),
    wins: integer("wins").default(0).notNull(),
    games: integer("games").default(0).notNull(),
    user0: text("user_0")
      .references(() => users.email)
      .notNull(),
    user1: text("user_1")
      .references(() => users.email)
      .notNull(),
  },
  (t) => ({
    unq: unique().on(t.user0, t.user1),
  }),
);

export type SoloMatch = typeof soloMatches.$inferSelect;

export const soloMatches = pgTable("solo_matches", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  player0: text("player_0")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  player1: text("player_1")
    .notNull()
    .references(() => users.email, { onDelete: "cascade" }),
  score0: integer("score_0").notNull(),
  score1: integer("score_1").notNull(),
  date: timestamp("date")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  draft: boolean("draft").notNull().default(true),
  mu0Change: doublePrecision("mu_0_change").default(0).notNull(),
  mu1Change: doublePrecision("mu_1_change").default(0).notNull(),
});

export const soloMatchesRelations = relations(soloMatches, ({ one }) => ({
  player0: one(users, {
    fields: [soloMatches.player0],
    references: [users.email],
  }),
  player1: one(users, {
    fields: [soloMatches.player1],
    references: [users.email],
  }),
}));
