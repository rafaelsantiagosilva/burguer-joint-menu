import jwt from "jsonwebtoken";
import { env } from "@/env.ts";

export function makeJwt(userId: string) {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "1h" });
} 