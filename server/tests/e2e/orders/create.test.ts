import { app } from "@/app.ts";
import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Order (E2E) - POST /orders/create", () => {
  let ordersRepository: DrizzleOrdersRepository;
  let productsRepository: DrizzleProductsRepository;
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();

    productsRepository = new DrizzleProductsRepository(db);
    ordersRepository = new DrizzleOrdersRepository(db);
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to create an order", async () => {
    const customer = await usersRepository.create("(00) 0000-0000", "customer", false);
    const items = [];

    for (let i = 0; i < 3; i++) {
      const newProduct = await productsRepository.create(
        `Product ${i}`,
        `Description of product ${i}`,
        1_500,
        null
      );

      items.push({
        productId: newProduct.id,
        productPrice: newProduct.price,
        quantity: 1
      });
    }

    const token = makeJwt(customer.id);

    const response = await request(app)
      .post(`/orders/create`)
      .set("Authorization", `Bearer ${token}`)
      .send(items);

    expect(response.status).toBe(StatusCodes.CREATED);
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