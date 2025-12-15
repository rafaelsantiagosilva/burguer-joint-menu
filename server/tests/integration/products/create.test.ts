import { InvalidProductPriceError } from "@/errors/InvalidProductPriceError.ts";
import { InMemoryProductsRepository } from "@/repositories/in-memory/in-memory-products-repository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateProductService } from "@/services/products/create.ts";

describe("Create Product Service", () => {
  let productsRepository: IProductsRepository;
  let sut: CreateProductService;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new CreateProductService(productsRepository);
  });

  it("should be able to create a product", async () => {
    const product = await sut.execute({
      name: "Product 1",
      price: 10,
      description: "Description 1",
      imagePath: null
    });

    const createdProduct = await productsRepository.findById(product.id);

    expect(createdProduct!.name).toBe("Product 1");
    expect(createdProduct!.price).toBe(10);
    expect(createdProduct!.description).toBe("Description 1");
  });

  it("should not be able to create a product with a negative price", async () => {
    await expect(async () =>
      await sut.execute({
        name: "Product 1",
        price: -10,
        description: "Description 1",
        imagePath: null
      })
    ).rejects.toBeInstanceOf(InvalidProductPriceError);
  });

  it("should not be able to create a product with a zero price", async () => {
    await expect(async () =>
      await sut.execute({
        name: "Product 1",
        price: 0,
        description: "Description 1",
        imagePath: null
      })
    ).rejects.toBeInstanceOf(InvalidProductPriceError);
  });
});