import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type { Order } from "@/models/order.ts";
import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

type FetchOrdersByUserIdRequest = {
  userId: string;
};

type FetchOrdersByUserIdResponse = Order[];

export class FetchOrdersByUserIdService {
  constructor(
    private ordersRepository: IOrdersRepository,
    private usersRepository: IUsersRepository
  ) { }

  async execute({ userId }: FetchOrdersByUserIdRequest): Promise<FetchOrdersByUserIdResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user)
      throw new ResourceNotFoundError();

    const userOrders = await this.ordersRepository.fetchByUserId(userId);
    return userOrders;
  }
}