import { app } from "@/app.ts";
import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Order (E2E) - PATCH /orders/status/:id", () => {
  let ordersRepository: DrizzleOrdersRepository;
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();

    ordersRepository = new DrizzleOrdersRepository(db);
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to change order status", async () => {
    const admin = await usersRepository.create("(11) 1111-1111", "admin", true);
    const customer = await usersRepository.create("(00) 0000-0000", "customer", false);
    const newOrder = await ordersRepository.create(customer.id, []);

    const token = makeJwt(admin.id);

    const response = await request(app)
      .patch(`/orders/status/${newOrder.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "QUEUE"
      });

    const updatedOrder = await ordersRepository.findById(newOrder.id);

    expect(response.status).toBe(StatusCodes.NO_CONTENT);
    expect(updatedOrder?.status).toBe("QUEUE");
  });

  it("should not be able to change order status with the user isn't admin", async () => {
    const admin = await usersRepository.create("(11) 1111-1111", "admin", false);
    const customer = await usersRepository.create("(00) 0000-0000", "customer", false);
    const newOrder = await ordersRepository.create(customer.id, []);

    const token = makeJwt(admin.id);

    const response = await request(app)
      .patch(`/orders/status/${newOrder.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "QUEUE"
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to change order status with a invalid token", async () => {
    const customer = await usersRepository.create("(00) 0000-0000", "customer", false);
    const newOrder = await ordersRepository.create(customer.id, []);

    const token = "invalid-token";

    const response = await request(app)
      .patch(`/orders/status/${newOrder.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        status: "QUEUE"
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});