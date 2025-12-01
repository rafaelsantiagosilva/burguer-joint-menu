import { orderProducts } from "@/database/schema/order_products.ts";

export type OrderProduct = typeof orderProducts.$inferSelect;