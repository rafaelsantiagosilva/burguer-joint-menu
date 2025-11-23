import { z } from "zod";
import dotenv from "dotenv";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  ENV: z.enum(["dev", "prod", "test"]).default("dev"),
});

dotenv.config();

export const env = envSchema.parse(process.env);