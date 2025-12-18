import { defineConfig } from 'drizzle-kit';
import { env as testEnv } from "./setup/env.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema",
  out: "./drizzle",
  dbCredentials: {
    url: testEnv.DATABASE_URL,
  }
});