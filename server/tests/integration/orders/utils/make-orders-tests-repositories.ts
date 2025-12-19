import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db } from "@/tests/setup/db.ts";

export function makeOrdersTestsRepositories() {
  const ordersRepository = new DrizzleOrdersRepository(db);
  const usersRepository = new DrizzleUsersRepository(db);
  const productsRepository = new DrizzleProductsRepository(db);

  return {
    ordersRepository,
    usersRepository,
    productsRepository,
  }
}