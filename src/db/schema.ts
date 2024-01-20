import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email: text("email").primaryKey(),
  name: text("name").notNull().unique(),
  image: text("image"),
});

export const single = pgTable("single", {
  elo: integer("elo").default(0).notNull(),
  user: text("user").references(() => users.email),
});

export const duo = pgTable("duo", {
  elo: integer("elo").default(0).notNull(),
});
