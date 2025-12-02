import type { Product } from "@/models/product.ts";

export default interface IProductsRepository {
  fetchAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  fetchManyByIds(ids: string[]): Promise<Product[]>;
  create(name: string, description: string | null, price: number, imagePath: string | null): Promise<Product>;
  isAvailable(productId: string): Promise<boolean>;
  setIsAvailable(productId: string, isAvailable: boolean): Promise<void>;
  delete(id: string): Promise<void>;
}