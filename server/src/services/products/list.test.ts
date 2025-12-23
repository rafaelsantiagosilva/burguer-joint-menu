import { beforeEach, describe, expect, it } from "vitest";
import { ListProductsService } from "./list.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { InMemoryProductsRepository } from "@/repositories/in-memory/in-memory-products-repository.ts";

describe("List Product Service (Unit)", () => {
  let productsRepository: IProductsRepository;
  let sut: ListProductsService;

  beforeEach(() => {
    productsRepository = new InMemoryProductsRepository();
    sut = new ListProductsService(productsRepository);
  });

  it("should be able to list all products", async () => {
    await productsRepository.create("Product 1", null, 10, null);
    await productsRepository.create("Product 2", null, 20, null);
    await productsRepository.create("Product 3", null, 30, null);

    const products = await sut.execute();

    expect(products.length).toBe(3);
    expect(products).toStrictEqual([
      expect.objectContaining({ name: "Product 1" }),
      expect.objectContaining({ name: "Product 2" }),
      expect.objectContaining({ name: "Product 3" }),
    ]);
  });
});