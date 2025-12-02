import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";

type DeleteProductServiceRequest = {
  id: string
};

type DeleteProductServiceResponse = void;

export class DeleteProductService {
  constructor(private productsRepository: IProductsRepository) { }

  async execute({ id }: DeleteProductServiceRequest): Promise<DeleteProductServiceResponse> {
    const product = await this.productsRepository.findById(id);

    if (!product)
      throw new ResourceNotFoundError();

    await this.productsRepository.delete(id);
  }
}