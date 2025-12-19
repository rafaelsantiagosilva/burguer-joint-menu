import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import type { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { FetchOrdersByUserIdService } from "@/services/orders/fetch-by-user-id.ts";
import { resetDatabase } from "@/tests/setup/db.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { makeOrdersTestsRepositories } from "./utils/make-orders-tests-repositories.ts";
import type { Order } from "@/models/order.ts";

describe("Fetch Order By User Id Service (Integration)", () => {
  let ordersRepository: DrizzleOrdersRepository;
  let usersRepository: DrizzleUsersRepository;
  let sut: FetchOrdersByUserIdService;

  let existingUserId: string;

  beforeEach(async () => {
    await resetDatabase();

    const mockedRepositories = makeOrdersTestsRepositories();

    ordersRepository = mockedRepositories.ordersRepository;
    usersRepository = mockedRepositories.usersRepository;

    const user = await usersRepository.create("john.doe@email.com", "password", false);
    existingUserId = user.id;

    sut = new FetchOrdersByUserIdService(ordersRepository, usersRepository);
  });

  it("should be able to fetch orders by user id", async () => {
    const newOrders = [];

    for (let i = 0; i < 3; i++) {
      const order = await ordersRepository.create(existingUserId, []);
      newOrders.push(order);
    }

    const sortedNewOrders = sortByDateDesc(newOrders);

    const orders = await sut.execute({ userId: existingUserId, page: 1 });

    expect(orders).toHaveLength(3);
    expect(orders).toStrictEqual(sortedNewOrders);
  });

  it("should be able to fetch orders by user id with pagination", async () => {
    const newOrders = [];

    for (let i = 0; i < 12; i++) {
      const order = await ordersRepository.create(existingUserId, []);
      newOrders.push(order);
    }

    const sortedNewOrders = sortByDateDesc(newOrders);

    const orders = await sut.execute({ userId: existingUserId, page: 2 });
    expect(orders).toHaveLength(2);
    expect(orders).toStrictEqual(sortedNewOrders.slice(10, 12));
  });

  it("should not be able to fetch orders for a non-existing user", async () => {
    const inexistingUserId = crypto.randomUUID();

    await expect(async () =>
      await sut.execute({ userId: inexistingUserId, page: 1 })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});

function sortByDateDesc(orders: Order[]) {
  return orders.sort((a, b) => {
    return b.date!.getTime() - a.date!.getTime()
  })
}