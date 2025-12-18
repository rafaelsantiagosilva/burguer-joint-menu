import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.ts";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts";
import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchOrdersByUserIdService } from "./fetch-by-user-id.ts";
import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";

describe("Fetch Order By User Id Service (Unit)", () => {
  let ordersRepository: IOrdersRepository;
  let usersRepository: IUsersRepository;
  let sut: FetchOrdersByUserIdService;

  let existingUserId: string;

  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();

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

    const orders = await sut.execute({ userId: existingUserId, page: 1 });
    expect(orders).toEqual(newOrders);
  });

  it("should be able to fetch orders by user id with pagination", async () => {
    const newOrders = [];

    for (let i = 0; i < 12; i++) {
      const order = await ordersRepository.create(existingUserId, []);
      newOrders.push(order);
    }

    const orders = await sut.execute({ userId: existingUserId, page: 2 });
    expect(orders).toHaveLength(2);
  });

  it("should not be able to fetch orders for a non-existing user", async () => {
    await expect(async () =>
      await sut.execute({ userId: "non-existing-user", page: 1 })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});