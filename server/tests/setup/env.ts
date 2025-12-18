import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ENV: z.enum(["dev", "prod", "test"]).default("test"),
  JWT_SECRET: z.string()
});

export const env = envSchema.parse(process.env);