import type { Product } from "@/models/product.ts";
import type IProductsRepository from "../IProductsRepository.ts";
import { db } from "@/database/index.ts";
import { products } from "@/database/schema/products.ts";

export class InMemoryProductsRepository implements IProductsRepository {
  public products: Product[] = [];

  async fetchAll(): Promise<Product[]> {
    return this.products;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.find((product) => product.id === id);
    return product || null;
  }

  async fetchManyByIds(ids: string[]): Promise<Product[]> {
    return this.products.filter((product) => ids.includes(product.id));
  }

  async create(name: string, description: string | null, price: number, imagePath: string | null): Promise<Product> {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      name,
      description,
      price,
      imagePath,
      isAvaliable: true,
    };

    this.products.push(newProduct);

    return newProduct;
  }

  async isAvailable(productId: string): Promise<boolean> {
    const product = this.products.find((product) => product.id === productId);
    return product?.isAvaliable ?? false;
  }

  async setIsAvailable(productId: string, isAvailable: boolean): Promise<void> {
    const productIndex = this.products.findIndex((product) => product.id === productId);

    if (productIndex >= 0)
      this.products[productIndex]!.isAvaliable = isAvailable;
  }
}