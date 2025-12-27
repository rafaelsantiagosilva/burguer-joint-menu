import { app } from "@/app.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Product (E2E) - DELETE /products/:id", () => {
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

  it("should be able to delete a product", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", true);
    const product = await productsRepository.create("Product 1", null, 10, null);
    const token = makeJwt(user.id);

    const response = await request(app).delete(`/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(StatusCodes.NO_CONTENT);
  });

  it("should not be able to delete a product that does not exist", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", true);
    const nonExistingProductId = crypto.randomUUID();
    const token = makeJwt(user.id);

    const response = await request(app)
      .delete(`/products/${nonExistingProductId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should not be able to delete a product if the token is invalid", async () => {
    const product = await productsRepository.create("Product 1", null, 10, null);
    const token = "invalid-token";

    const response = await request(app)
      .delete(`/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to delete a product if the token is missing", async () => {
    const product = await productsRepository.create("Product 1", null, 10, null);

    const response = await request(app)
      .delete(`/products/${product.id}`)

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to delete a product if the user is not admin", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const product = await productsRepository.create("Product 1", null, 10, null);
    const token = makeJwt(user.id);

    const response = await request(app).delete(`/products/${product.id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});