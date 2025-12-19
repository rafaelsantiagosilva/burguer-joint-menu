import { type DrizzleDatabase } from "@/database/index.ts";
import { orders as ordersTable, orderProducts as orderProductsTable } from "@/database/schema/index.ts";
import type { Order, OrderStatus } from "@/models/order.ts";
import { desc, eq } from "drizzle-orm";
import type IOrdersRepository from "../IOrdersRepository.ts";

export class DrizzleOrdersRepository implements IOrdersRepository {
  constructor(private readonly db: DrizzleDatabase) { }

  async findById(id: string): Promise<Order | null> {
    try {
      const result = await this.db.select().from(ordersTable).where(eq(ordersTable.id, id));
      const order = result[0] ?? null;
      return order;
    } catch {
      return null;
    }
  }

  async fetchAll(): Promise<Order[]> {
    const result = await this.db.select().from(ordersTable).orderBy(desc(ordersTable.date));
    return result;
  }

  async fetchByUserId(userId: string, page: number): Promise<Order[]> {
    const result = await this.db.select().from(ordersTable).where(eq(ordersTable.userId, userId))
      .limit(10).offset((page - 1) * 10)
      .orderBy(desc(ordersTable.date));

    const orders = result ?? [];
    return orders;
  }

  async create(
    userId: string,
    items: Array<{ productId: string; productPrice: number; quantity: number; }>
  ): Promise<Order> {
    let totalPrice = 0;

    for (const product of items)
      totalPrice += product.productPrice * product.quantity;

    const result = await this.db.insert(ordersTable).values({ userId, totalPrice }).returning();
    const order = result[0];

    if (order) {
      for (const product of items)
        await this.db.insert(orderProductsTable)
          .values({ orderId: order!.id, productId: product.productId, productQuantity: product.quantity });
    }

    return order as Order;
  }

  async changeStatus(orderId: string, status: OrderStatus): Promise<void> {
    await this.db.update(ordersTable).set({ status }).where(eq(ordersTable.id, orderId));
  }
}