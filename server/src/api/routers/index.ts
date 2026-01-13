import { db } from "@/database/index.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import type { Express } from "express";
import { ProductRouter } from "./product-router.ts";
import { UserRouter } from "./user-router.ts";
import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { OrderRouter } from "./order-router.ts";

export function registerRouters(app: Express) {
  const usersRepository = new DrizzleUsersRepository(db);
  const userRouter = new UserRouter(usersRepository);
  app.use("/users", userRouter.routes);

  const productsRepository = new DrizzleProductsRepository(db);
  const productRouter = new ProductRouter(productsRepository);
  app.use("/products", productRouter.routes);

  const ordersRepository = new DrizzleOrdersRepository(db);
  const orderRouter = new OrderRouter(
    ordersRepository,
    usersRepository,
    productsRepository
  );
  app.use("/orders", orderRouter.routes);
}