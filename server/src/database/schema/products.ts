import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";

export const products = table("products", {
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.text().notNull(),
  description: t.text(),
  price: t.integer().notNull(),
  imagePath: t.text("image_path"),
  isAvaliable: t.boolean("is_avaliable").default(true).notNull(),
});