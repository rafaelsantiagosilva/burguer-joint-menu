import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type { OrderStatus } from "@/models/order.ts";
import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";

type ChangeOrderStatusRequest = {
  id: string,
  newStatus: OrderStatus;
}

type ChangeOrderStatusResponse = void;

export class ChangeOrderStatusService {
  constructor(private ordersRepository: IOrdersRepository) { }

  async execute({ id, newStatus }: ChangeOrderStatusRequest): Promise<ChangeOrderStatusResponse> {
    const order = await this.ordersRepository.findById(id);

    if (!order)
      throw new ResourceNotFoundError();

    await this.ordersRepository.changeStatus(id, newStatus);
  }
}