import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.ts";
import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { ChangeOrderStatusService } from "./change-status.ts";

describe("Change Order Status Service (Unit)", () => {
  let ordersRepository: IOrdersRepository;
  let sut: ChangeOrderStatusService;

  beforeEach(() => {
    ordersRepository = new InMemoryOrdersRepository();
    sut = new ChangeOrderStatusService(ordersRepository);
  });

  it("should be able to change order status", async () => {
    const newOrder = await ordersRepository.create("user-1", []);
    await sut.execute({ id: newOrder.id, newStatus: "WAY" });

    const order = await ordersRepository.findById(newOrder.id);
    expect(order!.status).toBe("WAY");
  });

  it("should not be able to change order status if order not found", async () => {
    await expect(() =>
      sut.execute({ id: "order-1", newStatus: "WAY" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});