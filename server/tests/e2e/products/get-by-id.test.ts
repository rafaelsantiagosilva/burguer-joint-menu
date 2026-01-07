import { app } from "@/app.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Products (E2E) - GET /products/:id", () => {
  let productsRepository: DrizzleProductsRepository;
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();
    productsRepository = new DrizzleProductsRepository(db);
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to get a product by id", async () => {
    const product = await productsRepository.create("Product 1", null, 10000, null);
    const user = await usersRepository.create("phone", "password", false);

    const token = makeJwt(user.id);

    const response = await request(app).get(`/products/${product.id}`).set("Authorization", `Bearer ${token}`);

    expect(response.body).toStrictEqual(expect.objectContaining({
      name: "Product 1"
    }));
  });

  it("should not be able to list all products without authorization", async () => {
    const product = await productsRepository.create("Product 1", null, 10, null);

    const response = await request(app).get(`/products/${product.id}`);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  })
});