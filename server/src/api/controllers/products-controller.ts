import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { ActiveProductService } from "@/services/products/active.ts";
import { CreateProductService } from "@/services/products/create.ts";
import { DeleteProductService } from "@/services/products/delete.ts";
import { DisableProductService } from "@/services/products/disable.ts";
import { GetProductByIdService } from "@/services/products/get-by-id.ts";
import { ListProductsService } from "@/services/products/list.ts";
import { UpdateProductService } from "@/services/products/update.ts";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { uploadSingleAsync } from "../middlewares/upload.ts";
import { deleteLocalFile } from "@/utils/delete-local-file.ts";

const paramsSchema = z.object({ id: z.uuid() });

export class ProductsController {
  constructor(private productsRepository: IProductsRepository) { }

  async active(req: Request, res: Response) {
    const { id } = paramsSchema.parse(req.params);

    const activeProductService = new ActiveProductService(this.productsRepository);
    await activeProductService.execute({ id });

    res.status(StatusCodes.NO_CONTENT).end();
  }

  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      price: z.number().positive(),
    });

    const { name, description, price } = bodySchema.parse(req.body);

    if (!req.file)
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Image is required" });

    const createProductService = new CreateProductService(this.productsRepository);
    await createProductService.execute({
      name,
      description,
      price,
      imagePath: `/public/products/images/${req.file.filename}`
    });

    return res.status(StatusCodes.CREATED).end();
  }

  async delete(req: Request, res: Response) {
    const { id } = paramsSchema.parse(req.params);

    const deleteProductService = new DeleteProductService(this.productsRepository);
    await deleteProductService.execute({ id });

    return res.status(StatusCodes.NO_CONTENT).end();
  }

  async disable(req: Request, res: Response) {
    const { id } = paramsSchema.parse(req.params);

    const disableProductService = new DisableProductService(this.productsRepository);
    await disableProductService.execute({ id });

    res.status(StatusCodes.NO_CONTENT).end();
  }

  async list(_req: Request, res: Response) {
    const listProductsService = new ListProductsService(this.productsRepository);
    const products = await listProductsService.execute();

    return res.status(StatusCodes.OK).json(products);
  }

  async update(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      price: z.number().positive(),
      isAvaliable: z.boolean(),
    });

    const { id } = paramsSchema.parse(req.params);
    const { name, description, price, isAvaliable } = bodySchema.parse(req.body);
    const getProductByIdService = new GetProductByIdService(this.productsRepository);
    const product = await getProductByIdService.execute({ productId: id });

    if (req.file) {
      await uploadSingleAsync("image")(req, res);
      await deleteLocalFile(product.imagePath!);
    }

    const updateProductService = new UpdateProductService(this.productsRepository);
    await updateProductService.execute({
      id,
      name,
      description,
      imagePath: req.file?.filename ?? product.imagePath,
      price,
      isAvaliable
    });

    return res.status(StatusCodes.OK).json({ name, description, price, isAvaliable });
  }
}