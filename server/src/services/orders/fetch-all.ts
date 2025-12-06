import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";

export class FetchAllOrdersService {
  constructor(private ordersRepository: IOrdersRepository) { }

  async execute() {
    const orders = await this.ordersRepository.fetchAll();
    return orders;
  }
}