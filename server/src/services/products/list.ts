import type IProductsRepository from "@/repositories/IProductsRepository.ts";

export class ListProductsService {
  constructor(private productsRepository: IProductsRepository) { }

  async execute() {
    return await this.productsRepository.fetchAll();
  }
}