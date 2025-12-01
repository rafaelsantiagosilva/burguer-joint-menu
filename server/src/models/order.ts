import { orders } from "@/database/schema/orders.ts";

export type Order = typeof orders.$inferSelect;
export type OrderStatus = "QUEUE" | "COMPLETED" | "CANCELED" | "WAY" | "PREPARING";