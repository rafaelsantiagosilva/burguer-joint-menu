import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { InMemoryProductsRepository } from "@/repositories/in-memory/in-memory-products-repository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { DeleteProductService } from "./delete.ts";

describe("Delete Product Service", () => {
  let productsRepository: IProductsRepository;
  let sut: DeleteProductService;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new DeleteProductService(productsRepository);
  });

  it("should be able to delete an product", async () => {
    const { id } = await productsRepository.create("Product 1", null, 10, null);

    await sut.execute({ id });
    const product = await productsRepository.findById(id);

    expect(product).toBeNull();
  });

  it("should not be able to delete an product that does not exist", async () => {
    await expect(async () =>
      await sut.execute({ id: "product-1" })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});