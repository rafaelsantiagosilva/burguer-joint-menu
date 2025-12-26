import { env } from "@/env.ts";
import "dotenv/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Pool } from "pg";

export type DrizzleDatabase = NodePgDatabase<Record<string, never>> & { $client: Pool };

declare global {
  var __DB__: DrizzleDatabase;
}

export function makeDb(databaseUrl: string): DrizzleDatabase {
  if (globalThis.__DB__)
    return globalThis.__DB__;

  const db = drizzle({
    connection: databaseUrl,
    casing: "snake_case"
  });

  globalThis.__DB__ = db;

  return db;
};

export const db = makeDb(env.DATABASE_URL);