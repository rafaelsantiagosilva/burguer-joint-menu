import { upload } from "@/api/middlewares/upload.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import { Router } from "express";
import { ProductsController } from "../controllers/products-controller.ts";
import { adminVerify } from "../middlewares/admin-verify.ts";
import { auth } from "../middlewares/auth.ts";

export class ProductRouter {
  public routes: Router = Router();
  private productsController: ProductsController | null = null;

  constructor(private productsRepository: IProductsRepository) {
    this.productsController = new ProductsController(this.productsRepository);

    this.routes.patch("/active/:id", auth, adminVerify, this.productsController.active.bind(this.productsController));
    this.routes.post("/create", auth, adminVerify, this.productsController.create.bind(this.productsController));
    this.routes.post("/upload/:id", auth, adminVerify, upload.single("image"), this.productsController.upload.bind(this.productsController));
    this.routes.delete("/:id", auth, adminVerify, this.productsController.delete.bind(this.productsController));
    this.routes.patch("/disable/:id", auth, adminVerify, this.productsController.disable.bind(this.productsController));
    this.routes.get("/list", auth, this.productsController.list.bind(this.productsController));
    this.routes.put("/update/:id", auth, adminVerify, this.productsController.update.bind(this.productsController));
  }
}