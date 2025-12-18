import { env } from "./env.ts";
import { drizzle } from "drizzle-orm/node-postgres";
import * as tables from "@/database/schema/index.ts";

const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case"
});

export async function resetDatabase() {
  await db.delete(tables.orderProducts);
  await db.delete(tables.orders);
  await db.delete(tables.products);
  await db.delete(tables.users);
}

export { db };
