import { app } from "@/app.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Products (E2E) - GET /products/list", () => {
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

  it("should be able to list all products", async () => {
    await productsRepository.create("Product 1", null, 10, null);
    await productsRepository.create("Product 2", null, 20, null);
    await productsRepository.create("Product 3", null, 30, null);

    const user = await usersRepository.create("phone example", "password", false);
    const token = makeJwt(user.id);
    const { body } = await request(app).get("/products/list").set("Authorization", `Bearer ${token}`);

    expect(body).toHaveLength(3);
    expect(body).toStrictEqual([
      expect.objectContaining({ name: "Product 1" }),
      expect.objectContaining({ name: "Product 2" }),
      expect.objectContaining({ name: "Product 3" })
    ]);
  });

  it("should not be able to list all products without authorization", async () => {
    await productsRepository.create("Product 1", null, 10, null);
    await productsRepository.create("Product 2", null, 20, null);
    await productsRepository.create("Product 3", null, 30, null);

    const response = await request(app).get("/products/list");

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  })
});