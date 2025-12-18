import { InvalidProductPriceError } from "@/errors/InvalidProductPriceError.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { CreateProductService } from "@/services/products/create.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Create Product Service (Integration)", () => {
  let productsRepository: DrizzleProductsRepository;
  let sut: CreateProductService;

  beforeEach(async () => {
    await resetDatabase();

    productsRepository = new DrizzleProductsRepository(db);
    sut = new CreateProductService(productsRepository);
  });

  afterAll(async () => {
    await resetDatabase();
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