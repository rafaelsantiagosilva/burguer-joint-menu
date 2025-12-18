import { InvalidProductPriceError } from "@/errors/InvalidProductPriceError.ts";
import { InvalidProductQuantityError } from "@/errors/InvalidProductQuantityError.ts";
import { NotAvaliableProductError } from "@/errors/NotAvaliableProductError.ts";
import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { WithoutProductsError } from "@/errors/WithoutProductsError.ts";
import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { InMemoryOrdersRepository } from "@/repositories/in-memory/in-memory-orders-repository.ts";
import { InMemoryProductsRepository } from "@/repositories/in-memory/in-memory-products-repository.ts";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateOrderService } from "./create.ts";

describe("Create Order Service (Unit)", () => {
  let ordersRepository: IOrdersRepository;
  let usersRepository: IUsersRepository;
  let productsRepository: IProductsRepository;
  let sut: CreateOrderService;

  let existingUserId: string;
  let existingProductsIds: string[] = [];

  beforeEach(async () => {
    ordersRepository = new InMemoryOrdersRepository();
    usersRepository = new InMemoryUsersRepository();
    productsRepository = new InMemoryProductsRepository();

    const existingUser = await usersRepository.create(existingUserId, "password", false);
    existingUserId = existingUser.id;

    const newProducts = [
      { name: "Product 1", price: 10 },
      { name: "Product 2", price: 5 },
    ];

    newProducts.map(async (product) =>
      await productsRepository.create(product.name, null, product.price, null)
    )

    existingProductsIds = [];

    const products = await productsRepository.fetchAll()

    products.forEach((product) => {
      existingProductsIds.push(product.id);
    });

    sut = new CreateOrderService(ordersRepository, usersRepository, productsRepository);
  });

  it("should be able to create a new order", async () => {
    const order = await sut.execute({
      userId: existingUserId,
      items: [
        { productId: existingProductsIds[0]!, productPrice: 10, quantity: 2 },
        { productId: existingProductsIds[1]!, productPrice: 5, quantity: 1 },
      ],
    });

    expect(order.id).toBeTruthy();
  });

  it("should calculate the total price of the order correctly", async () => {
    const order = await sut.execute({
      userId: existingUserId,
      items: [
        { productId: existingProductsIds[0]!, productPrice: 10, quantity: 2 },
        { productId: existingProductsIds[1]!, productPrice: 5, quantity: 1 },
      ],
    });

    expect(order.totalPrice).toBe(25);
  });

  it("should not be able to create an order without products", async () => {
    await expect(async () =>
      await sut.execute({ userId: existingUserId, items: [] })
    ).rejects.toBeInstanceOf(WithoutProductsError);
  });

  it("should not be able to create an order for a non-existing user", async () => {
    await expect(async () =>
      await sut.execute({
        userId: "non-existing-user",
        items: [
          { productId: existingProductsIds[0]!, productPrice: 10, quantity: 2 },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order with a non-existing product", async () => {
    await expect(async () =>
      await sut.execute({
        userId: existingUserId,
        items: [
          { productId: "non-existing-product", productPrice: 10, quantity: 2 },

        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order with a not avaliable product", async () => {
    await productsRepository.setIsAvailable(existingProductsIds[0]!, false);

    await expect(async () =>
      await sut.execute({
        userId: existingUserId,
        items: [
          { productId: existingProductsIds[0]!, productPrice: 10, quantity: 1000 },
        ],
      })
    ).rejects.toBeInstanceOf(NotAvaliableProductError);
  });

  it("should not be able to create an order with a negative or zero quantity", async () => {
    await expect(async () =>
      await sut.execute({
        userId: existingUserId,
        items: [
          { productId: existingProductsIds[0]!, productPrice: 10, quantity: 0 },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidProductQuantityError);

    await expect(async () =>
      await sut.execute({
        userId: existingUserId,
        items: [
          { productId: existingProductsIds[0]!, productPrice: 10, quantity: -5 },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidProductQuantityError);
  });

  it("should not be able to create an order with a negative product price", async () => {
    await expect(async () =>
      await sut.execute({
        userId: existingUserId,
        items: [
          { productId: existingProductsIds[0]!, productPrice: -10, quantity: 2 },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidProductPriceError);

    await expect(async () =>
      await sut.execute({
        userId: existingUserId,
        items: [
          { productId: existingProductsIds[0]!, productPrice: 0, quantity: 2 },
        ],
      })
    ).rejects.toBeInstanceOf(InvalidProductPriceError);
  });
});