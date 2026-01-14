import { db } from "@/database/index.ts";
import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import type { Express } from "express";
import { OrderRouter } from "./order-router.ts";
import { ProductRouter } from "./product-router.ts";
import { UserRouter } from "./user-router.ts";

export function registerRouters(app: Express) {
  const usersRepository = new DrizzleUsersRepository(db);
  const productsRepository = new DrizzleProductsRepository(db);
  const ordersRepository = new DrizzleOrdersRepository(db);

  const userRouter = new UserRouter(usersRepository, ordersRepository);
  app.use("/users", userRouter.routes);

  const productRouter = new ProductRouter(productsRepository);
  app.use("/products", productRouter.routes);

  const orderRouter = new OrderRouter(
    ordersRepository,
    usersRepository,
    productsRepository
  );
  app.use("/orders", orderRouter.routes);
}