import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type { Product } from "@/models/product.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";

type UpdateProductServiceRequest = Product;

type UpdateProductServiceResponse = void;

export class UpdateProductService {
  constructor(private productsRepository: IProductsRepository) { }

  async execute(product: UpdateProductServiceRequest): Promise<UpdateProductServiceResponse> {
    const productExists = await this.productsRepository.findById(product.id);

    if (!productExists)
      throw new ResourceNotFoundError();

    await this.productsRepository.update(product);
  }
}