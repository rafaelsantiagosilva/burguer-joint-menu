import type { Express } from "express";
import { userRouter } from "./user.ts";

export function registerRouters(app: Express) {
  app.use(userRouter);
}