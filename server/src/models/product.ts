import { products } from "@/database/schema/products.ts";

export type Product = typeof products.$inferSelect;