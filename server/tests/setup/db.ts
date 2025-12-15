import { env } from "@/env.ts";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import * as tables from "@/database/schema/index.ts";

const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case"
});

export async function resetDatabase() {
  console.log("> Reseting database...");

  for (const table of Object.values(tables)) {
    // @ts-ignore
    await db.delete(table);
  }
}

export { db };
