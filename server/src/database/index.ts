import { env } from "@/env.ts";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case"
});

export { db };
