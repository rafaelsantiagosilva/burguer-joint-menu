import { app } from "@/app.ts";
import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Order (E2E) - GET /orders/:userId/:page", () => {
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

  it("should be able to fetch orders by customer ID", async () => {
    const admin = await usersRepository.create("(11) 1111-1111", "admin", true);
    const customer = await usersRepository.create("(00) 0000-0000", "customer", false);

    for (let i = 0; i < 5; i++)
      await ordersRepository.create(customer.id, []);

    const token = makeJwt(admin.id);

    const response = await request(app)
      .get(`/orders/user/${customer.id}/1`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveLength(5);
  });

  it("should not be able to fetch user orders if isn't an admin", async () => {
    const admin = await usersRepository.create("(11) 1111-1111", "admin", false);
    const token = makeJwt(admin.id);

    const customer = await usersRepository.create("(00) 0000-0000", "customer", false);

    const response = await request(app)
      .get(`/orders/user/${customer.id}/1`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to fetch user orders with a invalid token", async () => {
    const token = "invalid-token";
    const customer = await usersRepository.create("(00) 0000-0000", "customer", false);

    const response = await request(app)
      .get(`/orders/user/${customer.id}/1`)
      .set("Authorization", `Bearer ${token}`)

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});