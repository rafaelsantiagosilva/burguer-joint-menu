import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";

type ActiveProductServiceRequest = {
  id: string;
}

type ActiveProductServiceResponse = void;

export class ActiveProductService {
  constructor(private productsRepository: IProductsRepository) { }

  async execute({ id }: ActiveProductServiceRequest): Promise<ActiveProductServiceResponse> {
    const product = await this.productsRepository.findById(id);

    if (!product)
      throw new ResourceNotFoundError();

    await this.productsRepository.setIsAvailable(id, true);
  }
}