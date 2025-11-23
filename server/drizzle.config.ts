import { defineConfig } from 'drizzle-kit';
import { env } from "./src/env.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  }
});