import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { Router } from "express";
import { OrdersController } from "../controllers/orders-controller.ts";
import { adminVerify } from "../middlewares/admin-verify.ts";
import { auth } from "../middlewares/auth.ts";

export class OrderRouter {
  public routes: Router = Router();
  private ordersController: OrdersController | null = null;

  constructor(
    private ordersRepository: IOrdersRepository,
    private usersRepository: IUsersRepository,
    private productsRepository: IProductsRepository
  ) {
    this.ordersController = new OrdersController(this.ordersRepository, this.usersRepository, this.productsRepository);

    this.routes.patch("/status/:id", auth, adminVerify, this.ordersController.changeStatus.bind(this.ordersController));
    this.routes.post("/create", auth, this.ordersController.create.bind(this.ordersController));
    this.routes.get("/", auth, adminVerify, this.ordersController.fetchAll.bind(this.ordersController));
    this.routes.get("/user", auth, adminVerify, this.ordersController.fetchByUserId.bind(this.ordersController))
  }
}
