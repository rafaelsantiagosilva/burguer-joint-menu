import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { InMemoryProductsRepository } from "@/repositories/in-memory/in-memory-products-repository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { GetProductByIdService } from "./get-by-id.ts";

describe("Get Product By Id Service (Unit)", () => {
  let productsRepository: IProductsRepository;
  let sut: GetProductByIdService;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new GetProductByIdService(productsRepository);
  });

  it("should be able to get user profile", async () => {
    const createdProduct = await productsRepository.create("Product 1", "Test product", 10, null);
    const product = await sut.execute({ productId: createdProduct.id });

    expect(product).toEqual(createdProduct);
  });

  it("should not be able to get user profile with invalid user id", async () => {
    await expect(() =>
      sut.execute({ productId: "invalid-id" }))
      .rejects
      .toBeInstanceOf(ResourceNotFoundError);
  });
});