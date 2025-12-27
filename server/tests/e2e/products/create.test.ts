import { app } from "@/app.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Product (E2E) - POST /products/create", () => {
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

  it("should be able to create a product", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", true);
    const token = makeJwt(user.id);
    const newProduct = {
      name: "Product 1",
      description: "Description 1",
      price: 1000,
      imagePath: null
    }

    const response = await request(app).post("/products/create")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    expect(response.status).toBe(StatusCodes.CREATED);
  });

  it("should not be able to create a product if the token is invalid", async () => {
    const token = "invalid-token";
    const newProduct = {
      name: "Product 1",
      description: "Description 1",
      price: 1000,
      imagePath: null
    }

    const response = await request(app).post("/products/create")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to create a product if the token is missing", async () => {
    const newProduct = {
      name: "Product 1",
      description: "Description 1",
      price: 1000,
      imagePath: null
    }

    const response = await request(app).post("/products/create")
      .send(newProduct);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to create a product if the user is not admin", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const token = makeJwt(user.id);
    const newProduct = {
      name: "Product 1",
      description: "Description 1",
      price: 1000,
      imagePath: null
    }

    const response = await request(app).post("/products/create")
      .set("Authorization", `Bearer ${token}`)
      .send(newProduct);

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});