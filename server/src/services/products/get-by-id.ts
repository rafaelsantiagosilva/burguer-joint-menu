import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type { Product } from "@/models/product.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";

type GetProductByIdServiceRequest = {
  productId: string;
};

type GetProductByIdServiceResponse = Product;

export class GetProductByIdService {
  constructor(private productsRepository: IProductsRepository) { }

  async execute({ productId }: GetProductByIdServiceRequest): Promise<GetProductByIdServiceResponse> {
    const product = await this.productsRepository.findById(productId);

    if (!product)
      throw new ResourceNotFoundError();

    return product;
  }
}