import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { ListProductsService } from "@/services/products/list.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("List Product Service (Integration)", () => {
  let productsRepository: DrizzleProductsRepository;
  let sut: ListProductsService;

  beforeEach(async () => {
    await resetDatabase();

    productsRepository = new DrizzleProductsRepository(db);
    sut = new ListProductsService(productsRepository);
  });

  afterAll(async () => {
    resetDatabase();
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