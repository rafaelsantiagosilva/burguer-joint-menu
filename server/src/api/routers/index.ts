import type { Express } from "express";
import { UserRouter } from "./user-router.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";

export function registerRouters(app: Express) {
  const usersRepository = new DrizzleUsersRepository();
  const userRouter = new UserRouter(usersRepository);
  app.use("/users", userRouter.routes);
}