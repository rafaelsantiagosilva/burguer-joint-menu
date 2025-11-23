import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";

export const users = table("users", {
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.text(),
  email: t.text().unique().notNull(),
  password: t.text().notNull(),
  address: t.text(),
  isAdmin: t.boolean("is_admin").default(false),
});