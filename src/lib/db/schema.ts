import {
  boolean,
  doublePrecision,
  integer,
  pgTable,
  text,
  timestamp,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  githubId: text("github_id").unique(),
  googleSub: text("google_sub").unique(),
  email: text("email").notNull().unique(),
  username: text("name").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  lastOnlineAt: timestamp("last_online_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type Session = typeof sessions.$inferSelect;

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export type User = typeof users.$inferSelect;

export const usersRelation = relations(users, ({ one }) => ({
  solo: one(solo),
}));

export type Solo = typeof solo.$inferSelect;

export const solo = pgTable("solo", {
  user: text("user")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  skillMu: doublePrecision("skill_mu").notNull(),
  skillSigma: doublePrecision("skill_sigma").notNull(),
  wins: integer("wins").default(0).notNull(),
  games: integer("games").default(0).notNull(),
});

export const soloRelations = relations(solo, ({ one }) => ({
  user: one(users, {
    fields: [solo.user],
    references: [users.id],
  }),
}));

export type DuoMatch = typeof duo.$inferSelect;

export type Duo = typeof duo.$inferSelect;

export const duo = pgTable(
  "duo",
  {
    name: text("name").notNull().unique(),
    skillMu: doublePrecision("skill_mu").notNull(),
    skillSigma: doublePrecision("skill_sigma").notNull(),
    wins: integer("wins").default(0).notNull(),
    games: integer("games").default(0).notNull(),
    user0: text("user_0")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    user1: text("user_1")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    id: primaryKey({ name: "id", columns: [t.user0, t.user1] }),
  }),
);

export const duoMatches = pgTable("duo_matches", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  player0: text("player_0")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  player1: text("player_1")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  player2: text("player_2")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  player3: text("player_3")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  score0: integer("score_0").notNull(),
  score1: integer("score_1").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  draft: boolean("draft").notNull().default(true),
  accept0: boolean("accept_0").notNull().default(false),
  accept1: boolean("accept_1").notNull().default(false),
  accept2: boolean("accept_2").notNull().default(false),
  accept3: boolean("accept_3").notNull().default(false),
  mu0Change: doublePrecision("mu_0_change").default(0).notNull(),
  mu1Change: doublePrecision("mu_1_change").default(0).notNull(),
});

export const duoMatchesRelations = relations(duoMatches, ({ one }) => ({
  player0: one(users, {
    fields: [duoMatches.player0],
    references: [users.id],
  }),
  player1: one(users, {
    fields: [duoMatches.player1],
    references: [users.id],
  }),
  player2: one(users, {
    fields: [duoMatches.player2],
    references: [users.id],
  }),
  player3: one(users, {
    fields: [duoMatches.player3],
    references: [users.id],
  }),
  team0: one(duo, {
    fields: [duoMatches.player0, duoMatches.player1],
    references: [duo.user0, duo.user1],
  }),
  team1: one(duo, {
    fields: [duoMatches.player2, duoMatches.player3],
    references: [duo.user0, duo.user1],
  }),
}));

export type SoloMatch = typeof soloMatches.$inferSelect;

export const soloMatches = pgTable("solo_matches", {
  id: text("id")
    .primaryKey()
    .$default(() => crypto.randomUUID()),
  player0: text("player_0")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  player1: text("player_1")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  score0: integer("score_0").notNull(),
  score1: integer("score_1").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  draft: boolean("draft").notNull().default(true),
  accept0: boolean("accept_0").notNull().default(false),
  accept1: boolean("accept_1").notNull().default(false),
  mu0Change: doublePrecision("mu_0_change").default(0).notNull(),
  mu1Change: doublePrecision("mu_1_change").default(0).notNull(),
});

export const soloMatchesRelations = relations(soloMatches, ({ one }) => ({
  player0: one(users, {
    fields: [soloMatches.player0],
    references: [users.id],
  }),
  player1: one(users, {
    fields: [soloMatches.player1],
    references: [users.id],
  }),
}));
