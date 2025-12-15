import { InMemoryProductsRepository } from "@/repositories/in-memory/in-memory-products-repository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { DisableProductService } from "@/services/products/disable.ts";
import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";

describe("Disable Product Service", () => {
  let productsRepository: IProductsRepository;
  let sut: DisableProductService;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new DisableProductService(productsRepository);
  });

  it("should be able to disable a product", async () => {
    const { id } = await productsRepository.create("Product 1", null, 10, null);

    await sut.execute({ id });
    const product = await productsRepository.findById(id);

    expect(product!.isAvaliable).toBe(false);
  });

  it("should not be able to disable a product that does not exist", async () => {
    await expect(async () =>
      await sut.execute({ id: "product-1" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});