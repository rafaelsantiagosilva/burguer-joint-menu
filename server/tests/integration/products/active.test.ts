import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { InMemoryProductsRepository } from "@/repositories/in-memory/in-memory-products-repository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { ActiveProductService } from "@/services/products/active.ts";

describe("Active Product Service", () => {
  let productsRepository: IProductsRepository;
  let sut: ActiveProductService;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new ActiveProductService(productsRepository);
  });

  it("should be able to active a product", async () => {
    const { id } = await productsRepository.create("Product 1", null, 10, null);
    await productsRepository.setIsAvailable(id, false);

    await sut.execute({ id });
    const product = await productsRepository.findById(id);

    expect(product!.isAvaliable).toBe(true);
  });

  it("should not be able to active a product that does not exist", async () => {
    await expect(async () =>
      await sut.execute({ id: "product-1" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});