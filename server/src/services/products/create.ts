import { InvalidProductPriceError } from "@/errors/InvalidProductPriceError.ts";
import type { Product } from "@/models/product.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";

type CreateProductServiceRequest = {
  name: string;
  description: string | null;
  price: number;
  imagePath: string | null;
};

type CreateProductServiceResponse = Product;

export class CreateProductService {
  constructor(private productsRepository: IProductsRepository) { }

  async execute({ name, price, description, imagePath }: CreateProductServiceRequest): Promise<CreateProductServiceResponse> {
    if (price <= 0)
      throw new InvalidProductPriceError();

    const product = await this.productsRepository.create(
      name,
      description,
      price,
      imagePath
    );

    return product;
  }
}