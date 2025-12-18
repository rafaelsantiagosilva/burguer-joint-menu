import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { InMemoryProductsRepository } from "@/repositories/in-memory/in-memory-products-repository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { UpdateProductService } from "./update.ts";

describe("Update Product Service (Unit)", () => {
  let productsRepository: IProductsRepository;
  let sut: UpdateProductService;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new UpdateProductService(productsRepository);
  });

  it("should be able to update a product", async () => {
    const product = await productsRepository.create(
      "Product 1",
      null,
      10,
      null
    );

    await sut.execute({
      ...product,
      name: "Updated Product",
      price: 20,
      isAvaliable: false
    });

    const updatedProduct = await productsRepository.findById(product.id);

    expect(updatedProduct).toEqual(expect.objectContaining({
      id: product.id,
      name: "Updated Product",
      price: 20,
      isAvaliable: false,
      imagePath: null,
      description: null
    }));
  });

  it("should not be able to update a non-existing product", async () => {
    await expect(async () =>
      await sut.execute({
        id: "non-existing-product",
        name: "Updated Product",
        price: 20,
        isAvaliable: false,
        imagePath: null,
        description: null
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
