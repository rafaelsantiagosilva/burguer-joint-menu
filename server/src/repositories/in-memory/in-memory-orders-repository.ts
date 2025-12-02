import type { Order, OrderStatus } from "@/models/order.ts";
import type { OrderProduct } from "@/models/order_products.ts";
import { paginate } from "@/utils/paginate.ts";
import type IOrdersRepository from "../IOrdersRepository.ts";

export class InMemoryOrdersRepository implements IOrdersRepository {
  public orders: Order[] = [];
  public orderProducts: Array<OrderProduct> = [];
  private currentOrderProductsId = 1;

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.find((order) => order.id === id);
    return order || null;
  }

  async fetchAll(): Promise<Order[]> {
    return this.orders;
  }

  async fetchByUserId(userId: string, page: number): Promise<Order[]> {
    const orders = this.orders.filter((order) => order.userId === userId);
    return paginate(orders, page);
  }

  async create(userId: string, items: Array<{ productId: string; productPrice: number; quantity: number; }>): Promise<Order> {
    let totalPrice = 0;
    const id = crypto.randomUUID();

    for (const product of items) {
      totalPrice += product.productPrice * product.quantity;

      this.orderProducts.push({
        id: this.currentOrderProductsId++,
        orderId: id,
        productId: product.productId,
        productQuantity: product.quantity,
      });
    }

    const newOrder: Order = {
      id,
      userId,
      status: "QUEUE",
      totalPrice,
      date: new Date(),
    }

    this.orders.push(newOrder);

    return newOrder;
  }

  async changeStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orderIndex = this.orders.findIndex((order) => order.id === orderId);

    if (orderIndex >= 0)
      this.orders[orderIndex]!.status = status;
  }
}