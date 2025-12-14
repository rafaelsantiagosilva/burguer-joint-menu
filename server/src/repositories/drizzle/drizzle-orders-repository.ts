import { db } from "@/database/index.ts";
import { orderProducts as orderProductsTable } from "@/database/schema/order_products.ts";
import { orders as ordersTable } from "@/database/schema/orders.ts";
import type { Order, OrderStatus } from "@/models/order.ts";
import { desc, eq } from "drizzle-orm";
import type IOrdersRepository from "../IOrdersRepository.ts";

export class DrizzleOrdersRepository implements IOrdersRepository {
  async findById(id: string): Promise<Order | null> {
    const result = await db.select().from(ordersTable).where(eq(ordersTable, id));
    const order = result[0] ?? null;
    return order;
  }

  async fetchAll(): Promise<Order[]> {
    const result = await db.select().from(ordersTable).orderBy(desc(ordersTable.date));
    return result;
  }

  async fetchByUserId(userId: string, page: number): Promise<Order[]> {
    const result = await db.select().from(ordersTable).where(eq(ordersTable.userId, userId))
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

    const result = await db.insert(ordersTable).values({ userId, totalPrice }).returning();
    const order = result[0];

    if (order) {
      for (const product of items)
        await db.insert(orderProductsTable)
          .values({ orderId: order!.id, productId: product.productId, productQuantity: product.quantity });
    }

    return order as Order;
  }

  async changeStatus(orderId: string, status: OrderStatus): Promise<void> {
    await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, orderId));
  }
}