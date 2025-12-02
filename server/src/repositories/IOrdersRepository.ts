import type { Order, OrderStatus } from "@/models/order.ts";

export default interface IOrdersRepository {
  findById(id: string): Promise<Order | null>;
  fetchAll(): Promise<Order[]>;
  fetchByUserId(userId: string, page: number): Promise<Order[]>;
  create(
    userId: string,
    items: Array<{
      productId: string;
      productPrice: number;
      quantity: number;
    }>): Promise<Order>;
  changeStatus(orderId: string, status: OrderStatus): Promise<void>;
}