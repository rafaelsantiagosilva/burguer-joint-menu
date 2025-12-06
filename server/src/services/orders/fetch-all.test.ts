import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.ts";
import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchAllOrdersService } from "./fetch-all.ts";

describe("Fetch Order By User Id Service", () => {
  let ordersRepository: IOrdersRepository;
  let sut: FetchAllOrdersService;

  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository();

    const items = [
      { productId: "product-1", productPrice: 12, quantity: 1 },
      { productId: "product-2", productPrice: 1, quantity: 10 },
      { productId: "product-3", productPrice: 9.99, quantity: 1 }
    ];

    ordersRepository.create(
      "user-1",
      items
    );

    ordersRepository.create(
      "user-2",
      items
    );

    sut = new FetchAllOrdersService(ordersRepository);
  });

  it("should be able to fetch all orders", async () => {
    const data = await sut.execute();
    expect(data).toHaveLength(2);
  });
});