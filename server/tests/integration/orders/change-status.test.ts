import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { ChangeOrderStatusService } from "@/services/orders/change-status.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Change Order Status Service (Integration)", () => {
  let ordersRepository: DrizzleOrdersRepository;
  let usersRepository: DrizzleUsersRepository;
  let sut: ChangeOrderStatusService;

  beforeEach(async () => {
    await resetDatabase();

    usersRepository = new DrizzleUsersRepository(db);
    ordersRepository = new DrizzleOrdersRepository(db);
    sut = new ChangeOrderStatusService(ordersRepository);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to change order status", async () => {
    const newUser = await usersRepository.create("(01) X2345-6789", "123456", false);
    const newOrder = await ordersRepository.create(newUser.id, []);

    await sut.execute({ id: newOrder.id, newStatus: "WAY" });
    const order = await ordersRepository.findById(newOrder.id);

    expect(order!.status).toBe("WAY");
  });

  it("should not be able to change order status if order not found", async () => {
    const inexistingOrderId = crypto.randomUUID();

    await expect(() =>
      sut.execute({ id: inexistingOrderId, newStatus: "WAY" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
