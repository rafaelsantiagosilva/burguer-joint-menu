import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { GetProductByIdService } from "@/services/products/get-by-id.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { beforeEach, describe, expect, it } from "vitest";

describe("Get Product By Id Service (Unit)", () => {
  let productsRepository: IProductsRepository;
  let sut: GetProductByIdService;

  beforeEach(async () => {
    await resetDatabase();

    productsRepository = new DrizzleProductsRepository(db);
    sut = new GetProductByIdService(productsRepository);
  });

  it("should be able to get user profile", async () => {
    const createdProduct = await productsRepository.create("Product 1", "Test product", 10, null);
    const product = await sut.execute({ productId: createdProduct.id });

    expect(product).toEqual(createdProduct);
  });

  it("should not be able to get user profile with invalid user id", async () => {
    const invalidProductId = crypto.randomUUID();

    await expect(() =>
      sut.execute({ productId: invalidProductId }))
      .rejects
      .toBeInstanceOf(ResourceNotFoundError);
  });
});