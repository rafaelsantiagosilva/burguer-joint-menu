import { db } from "@/database/index.ts";
import { products as productsTable } from "@/database/schema/products.ts";
import type { Product } from "@/models/product.ts";
import { asc, eq, sql } from "drizzle-orm";
import type IProductsRepository from "../IProductsRepository.ts";

export class DrizzleProductsRepository implements IProductsRepository {
  async fetchAll(): Promise<Product[]> {
    const result = await db.select().from(productsTable).orderBy(asc(productsTable.name));
    return result;
  }

  async findById(id: string): Promise<Product | null> {
    const result = await db.select().from(productsTable).where(eq(productsTable.id, id));
    const product = result[0] ?? null;
    return product;
  }

  async fetchManyByIds(ids: string[]): Promise<Product[]> {
    let condition = "";

    for (let i = 0; i < ids.length; i++) {
      condition += `${productsTable.id} = ${ids[i]}`;
      condition += (i != ids.length - 1 ? " OR " : "");
    }

    const products = await db.select().from(productsTable).where(sql`${condition}`);

    return products;
  }

  async create(name: string, description: string | null, price: number, imagePath: string | null): Promise<Product> {
    const product = await db.insert(productsTable).values({
      name,
      description,
      price,
      imagePath
    }).returning();

    return product[0] as Product;
  }

  async update(product: Product): Promise<void> {
    await db.update(productsTable).set(product).where(eq(productsTable.id, product.id));
  }

  async isAvailable(productId: string): Promise<boolean> {
    const result = await db.select().from(productsTable).where(eq(productsTable.id, productId));
    const product = result[0] ?? null;
    return product?.isAvaliable ?? false;
  }

  async setIsAvailable(productId: string, isAvailable: boolean): Promise<void> {
    await db.update(productsTable).set({ isAvaliable: isAvailable }).where(eq(productsTable.id, productId));
  }

  async delete(id: string): Promise<void> {
    await db.delete(productsTable).where(eq(productsTable.id, id));
  }
}