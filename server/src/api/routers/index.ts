import { db } from "@/database/index.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import type { Express } from "express";
import { ProductRouter } from "./product-router.ts";
import { UserRouter } from "./user-router.ts";

export function registerRouters(app: Express) {
  const usersRepository = new DrizzleUsersRepository(db);
  const userRouter = new UserRouter(usersRepository);
  app.use("/users", userRouter.routes);

  const productsRepository = new DrizzleProductsRepository(db);
  const productRouter = new ProductRouter(productsRepository);
  app.use("/products", productRouter.routes);
}