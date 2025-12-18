import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { ActiveProductService } from "@/services/products/active.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Active Product Service (Integration)", () => {
  let productsRepository: DrizzleProductsRepository;
  let sut: ActiveProductService;

  beforeEach(async () => {
    await resetDatabase();

    productsRepository = new DrizzleProductsRepository(db);
    sut = new ActiveProductService(productsRepository);
  });

  afterAll(async () => {
    await resetDatabase();
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