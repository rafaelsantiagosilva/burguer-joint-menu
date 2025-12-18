import { env } from "@/env.ts";
import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

export const db = drizzle({
  connection: env.DATABASE_URL,
  casing: "snake_case"
});

export type DrizzleDatabase = typeof db;
