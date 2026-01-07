import { app } from "@/app.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Product (E2E) - PUT /products/update/:id", () => {
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

  it("should be able to update a product", async () => {
    const product = await productsRepository.create(
      "Product 1",
      null,
      10,
      null
    );

    const user = await usersRepository.create("phone", "password", true);
    const token = makeJwt(user.id);

    product.isAvaliable = false;

    await request(app)
      .put(`/products/update/${product.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(product);

    const updatedProduct = await productsRepository.findById(product.id);

    expect(updatedProduct).toStrictEqual(expect.objectContaining({
      isAvaliable: false
    }));
  });

  it("should not be able to update a product if isn't a admin", async () => {
    const product = await productsRepository.create(
      "Product 1",
      null,
      10,
      null
    );

    const user = await usersRepository.create("phone", "password", false);
    const token = makeJwt(user.id);

    product.isAvaliable = false;

    const response = await request(app)
      .put(`/products/update/${product.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send(product);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to update a product if don't exists", async () => {
    const product = await productsRepository.create(
      "Product 1",
      null,
      10,
      null
    );

    const user = await usersRepository.create("phone", "password", true);
    const token = makeJwt(user.id);

    product.isAvaliable = false;

    const inexistingProductId = crypto.randomUUID();

    const response = await request(app)
      .put(`/products/update/${inexistingProductId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(product);

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});
