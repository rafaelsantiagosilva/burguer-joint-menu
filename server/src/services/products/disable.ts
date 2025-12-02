import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";

type DisableProductServiceRequest = {
  id: string;
}

type DisableProductServiceResponse = void;

export class DisableProductService {
  constructor(private productsRepository: IProductsRepository) { }

  async execute({ id }: DisableProductServiceRequest): Promise<DisableProductServiceResponse> {
    const product = await this.productsRepository.findById(id);

    if (!product)
      throw new ResourceNotFoundError();

    await this.productsRepository.setIsAvailable(id, false);
  }
}