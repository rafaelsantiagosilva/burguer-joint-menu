import { InvalidProductPriceError } from "@/errors/InvalidProductPriceError.ts";
import { InvalidProductQuantityError } from "@/errors/InvalidProductQuantityError.ts";
import { NotAvaliableProductError } from "@/errors/NotAvaliableProductError.ts";
import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { WithoutProductsError } from "@/errors/WithoutProductsError.ts";
import type { Order } from "@/models/order.ts";
import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

type CreateOrderRequest = {
  userId: string,
  items: Array<{ productId: string; productPrice: number; quantity: number; }>
}

type CreateOrderResponse = Order;

export class CreateOrderService {
  constructor(
    private ordersRepository: IOrdersRepository,
    private usersRepository: IUsersRepository,
    private productsRepository: IProductsRepository,
  ) { }

  async execute({ userId, items }: CreateOrderRequest): Promise<CreateOrderResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user)
      throw new ResourceNotFoundError();

    if (!items || items.length === 0)
      throw new WithoutProductsError();

    const productsIds = items.map(i => i.productId);
    const products = await this.productsRepository.fetchManyByIds(productsIds);
    const productsMap = new Map(products.map(p => [p.id, p]));

    for (const item of items) {
      const product = productsMap.get(item.productId);

      if (!product)
        throw new ResourceNotFoundError();

      if (!product.isAvaliable)
        throw new NotAvaliableProductError();

      if (product.price !== item.productPrice || item.productPrice <= 0)
        throw new InvalidProductPriceError();

      if (item.quantity <= 0)
        throw new InvalidProductQuantityError();
    }

    const order = await this.ordersRepository.create(userId, items);
    return order;
  }
}