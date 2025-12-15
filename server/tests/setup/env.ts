import { z } from "zod";
import dotenv from "dotenv";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  ENV: z.literal("test"),
  JWT_SECRET: z.string()
});

dotenv.config();

export const env = envSchema.parse(process.env);