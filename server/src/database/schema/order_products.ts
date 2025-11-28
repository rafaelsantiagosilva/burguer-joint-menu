import * as t from "drizzle-orm/pg-core";
import { pgTable as table } from "drizzle-orm/pg-core";
import { orders } from "./orders.ts";
import { products } from "./products.ts";


export const orderProducts = table("order_products", {
  id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: t.uuid("order_id").references(() => orders.id).notNull(),
  productId: t.uuid("product_id").references(() => products.id).notNull(),
  productQuantity: t.integer("product_quantity").default(1).notNull(),
});