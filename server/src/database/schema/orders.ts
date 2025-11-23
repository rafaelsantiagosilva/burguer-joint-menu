import * as t from "drizzle-orm/pg-core";
import { pgEnum, pgTable as table } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const statusEnum = pgEnum("order_status", ["QUEUE", "COMPLETED", "CANCELED", "WAY", "PREPARING"]);

export const orders = table("orders", {
  id: t.uuid().primaryKey().defaultRandom(),
  userId: t.uuid("user_id").references(() => users.id).notNull(),
  totalPrice: t.integer("total_price").notNull(),
  date: t.timestamp().defaultNow(),
  status: statusEnum().default("QUEUE"),
});