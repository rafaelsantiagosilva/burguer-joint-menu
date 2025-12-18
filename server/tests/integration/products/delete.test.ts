import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DeleteProductService } from "@/services/products/delete.ts";
import { resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Delete Product Service (Integration)", () => {
  let productsRepository: DrizzleProductsRepository;
  let sut: DeleteProductService;

  beforeEach(async () => {
    await resetDatabase();

    productsRepository = new DrizzleProductsRepository();
    sut = new DeleteProductService(productsRepository);
  });

  afterAll(async () => {
    await resetDatabase();
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