import { app } from "@/app.ts";
import { DiskStorageProvider } from "@/providers/disk-storage-provider.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Product (E2E) - POST /products/upload/:id", () => {
  let productsRepository: DrizzleProductsRepository;
  let usersRepository: DrizzleUsersRepository;
  let storageProvider: DiskStorageProvider;

  beforeEach(async () => {
    await resetDatabase();
    storageProvider = new DiskStorageProvider();
    productsRepository = new DrizzleProductsRepository(db);
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to upload an image to the product", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", true);
    const token = makeJwt(user.id);

    const createdProduct = await productsRepository.create("Product 1", "Description 1", 1_000, null);

    const response = await request(app)
      .post(`/products/upload/${createdProduct.id}`)
      .attach("image", "tests/e2e/products/fixtures/test-image.png")
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data");

    await storageProvider.delete(response.body.imagePath);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty("imagePath");
  });

  it("should not be able to upload an image to the product if the token is invalid", async () => {
    const token = "invalid-token";
    const createdProduct = await productsRepository.create("Product 1", "Description 1", 1_000, null);

    const response = await request(app)
      .post(`/products/upload/${createdProduct.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data");

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to upload an image to the product if the token is missing", async () => {
    const createdProduct = await productsRepository.create("Product 1", "Description 1", 1_000, null);

    const response = await request(app)
      .post(`/products/upload/${createdProduct.id}`)
      .set("Content-Type", "multipart/form-data");

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to upload an image a product if the user is not admin", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const token = makeJwt(user.id);

    const createdProduct = await productsRepository.create("Product 1", "Description 1", 1_000, null);

    const response = await request(app)
      .post(`/products/upload/${createdProduct.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-Type", "multipart/form-data");

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});