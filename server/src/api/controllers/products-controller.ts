import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import type { Request, Response } from "express";

export class ProductsController {
  constructor(private productsRepository: IProductsRepository) { }

  async active(req: Request, res: Response) {

  }

  async create(req: Request, res: Response) {

  }

  async delete(req: Request, res: Response) {

  }

  async disable(req: Request, res: Response) {

  }

  async update(req: Request, res: Response) {

  }
}