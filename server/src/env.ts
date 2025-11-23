import { z } from "zod";
import dotenv from "dotenv";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
});

dotenv.config();

export const env = envSchema.parse(process.env);