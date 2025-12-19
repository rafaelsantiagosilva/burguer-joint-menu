import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { UpdateProductService } from "@/services/products/update.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Update Product Service (Integration)", () => {
  let productsRepository: DrizzleProductsRepository;
  let sut: UpdateProductService;

  beforeEach(async () => {
    await resetDatabase();

    productsRepository = new DrizzleProductsRepository(db);
    sut = new UpdateProductService(productsRepository);
  });

  afterAll(async () => {
    await resetDatabase();
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
    const inexistingProductId = crypto.randomUUID();

    await expect(async () =>
      await sut.execute({
        id: inexistingProductId,
        name: "Updated Product",
        price: 20,
        isAvaliable: false,
        imagePath: null,
        description: null
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
