import { pgTable, text, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  email: text("email").primaryKey(),
  name: text("name").notNull().unique(),
  elo: integer("elo").default(0),
  image: text("image"),
});
