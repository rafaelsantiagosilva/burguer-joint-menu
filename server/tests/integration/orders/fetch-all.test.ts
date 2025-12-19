import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import type { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { FetchAllOrdersService } from "@/services/orders/fetch-all.ts";
import { resetDatabase } from "@/tests/setup/db.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { makeOrdersTestsRepositories } from "./utils/make-orders-tests-repositories.ts";

describe("Fetch Order By User Id Service (Integration)", () => {
  let ordersRepository: DrizzleOrdersRepository;
  let usersRepository: DrizzleUsersRepository;
  let productsRepository: DrizzleProductsRepository;
  let sut: FetchAllOrdersService;

  beforeEach(async () => {
    await resetDatabase();

    const mockedRepositories = makeOrdersTestsRepositories();

    ordersRepository = mockedRepositories.ordersRepository;
    usersRepository = mockedRepositories.usersRepository;
    productsRepository = mockedRepositories.productsRepository;

    sut = new FetchAllOrdersService(ordersRepository);
  });

  it("should be able to fetch all orders", async () => {
    const { user1, user2, items } = await makeMocks(usersRepository, productsRepository);

    await ordersRepository.create(
      user1.id,
      items
    );

    await ordersRepository.create(
      user2.id,
      items
    );

    const data = await sut.execute();
    expect(data).toHaveLength(2);
  });
});

async function makeMocks(
  usersRepository: DrizzleUsersRepository,
  productsRepository: DrizzleProductsRepository
) {
  const user1 = await usersRepository.create("(01) X2345-6789", "password", false);
  const user2 = await usersRepository.create("(02) X2345-6789", "password", false);

  const product1 = await productsRepository.create("Product 1", null, 1200, null);
  const product2 = await productsRepository.create("Product 2", null, 100, null);
  const product3 = await productsRepository.create("Product 3", null, 999, null);

  const items = [
    { productId: product1.id, productPrice: product1.price, quantity: 1 },
    { productId: product2.id, productPrice: product2.price, quantity: 1 },
    { productId: product3.id, productPrice: product3.price, quantity: 1 },
  ];

  return {
    user1,
    user2,
    items
  }
}