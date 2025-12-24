import { makeDb } from "@/database/index.ts";
import * as tables from "@/database/schema/index.ts";
import { env } from "./env.ts";

const db = makeDb(env.DATABASE_URL);

export async function resetDatabase() {
  await db.delete(tables.orderProducts);
  await db.delete(tables.orders);
  await db.delete(tables.products);
  await db.delete(tables.users);
}

export { db };
