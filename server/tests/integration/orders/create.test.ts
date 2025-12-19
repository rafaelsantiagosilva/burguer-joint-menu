import { InvalidProductPriceError } from "@/errors/InvalidProductPriceError.ts";
import { InvalidProductQuantityError } from "@/errors/InvalidProductQuantityError.ts";
import { NotAvaliableProductError } from "@/errors/NotAvaliableProductError.ts";
import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { WithoutProductsError } from "@/errors/WithoutProductsError.ts";
import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { DrizzleProductsRepository } from "@/repositories/drizzle/drizzle-products-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { CreateOrderService } from "@/services/orders/create.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Create Order Service (Integration)", () => {
  let ordersRepository: DrizzleOrdersRepository;
  let usersRepository: DrizzleUsersRepository;
  let productsRepository: DrizzleProductsRepository;
  let sut: CreateOrderService;

  beforeEach(async () => {
    await resetDatabase();

    const repositoriesMocks = await mockRepositories();

    ordersRepository = repositoriesMocks.ordersRepository;
    usersRepository = repositoriesMocks.usersRepository;
    productsRepository = repositoriesMocks.productsRepository;

    sut = new CreateOrderService(ordersRepository, usersRepository, productsRepository);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to create a new order", async () => {
    const { existingProductsIds, existingUserId } = await mockValues(usersRepository, productsRepository);

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
    const { existingProductsIds, existingUserId } = await mockValues(usersRepository, productsRepository);

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
    const { existingProductsIds, existingUserId } = await mockValues(usersRepository, productsRepository);

    await expect(async () =>
      await sut.execute({ userId: existingUserId, items: [] })
    ).rejects.toBeInstanceOf(WithoutProductsError);
  });

  it("should not be able to create an order for a non-existing user", async () => {
    const { existingProductsIds } = await mockValues(usersRepository, productsRepository);
    const inexistingUserId = crypto.randomUUID();

    await expect(async () =>
      await sut.execute({
        userId: inexistingUserId,
        items: [
          { productId: existingProductsIds[0]!, productPrice: 10, quantity: 2 },
        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order with a non-existing product", async () => {
    const { existingUserId } = await mockValues(usersRepository, productsRepository);
    const inexistingProductId = crypto.randomUUID();

    await expect(async () =>
      await sut.execute({
        userId: existingUserId,
        items: [
          { productId: inexistingProductId, productPrice: 10, quantity: 2 },

        ],
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  });

  it("should not be able to create an order with a not avaliable product", async () => {
    const { existingProductsIds, existingUserId } = await mockValues(usersRepository, productsRepository);

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
    const { existingProductsIds, existingUserId } = await mockValues(usersRepository, productsRepository);

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
    const { existingProductsIds, existingUserId } = await mockValues(usersRepository, productsRepository);

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

async function mockRepositories() {
  const ordersRepository = new DrizzleOrdersRepository(db);
  const usersRepository = new DrizzleUsersRepository(db);
  const productsRepository = new DrizzleProductsRepository(db);

  return {
    ordersRepository,
    usersRepository,
    productsRepository,
  }
}

async function mockValues(
  usersRepository: DrizzleUsersRepository,
  productsRepository: DrizzleProductsRepository
) {
  const existingUser = await usersRepository.create("(01) X2345-6789", "password", false);
  const existingUserId = existingUser.id;

  const product1 = await productsRepository.create("Product 1", null, 10, null);
  const product2 = await productsRepository.create("Product 2", null, 5, null);

  const existingProductsIds: string[] = [
    product1.id,
    product2.id
  ];

  return {
    existingUserId,
    existingProductsIds,
  };
}