import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DisableProductService } from "@/services/products/disable.ts";
import { beforeEach, describe, expect, it } from "vitest";

describe("Disable Product Service (Unit)", () => {
  let productsRepository: DrizzleProductsRepository;
  let sut: DisableProductService;

  beforeEach(() => {
    productsRepository = new DrizzleProductsRepository();
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