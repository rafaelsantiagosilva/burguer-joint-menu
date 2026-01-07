import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";
import type IProductsRepository from "@/repositories/IProductsRepository.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { ChangeOrderStatusService } from "@/services/orders/change-status.ts";
import { CreateOrderService } from "@/services/orders/create.ts";
import { FetchAllOrdersService } from "@/services/orders/fetch-all.ts";
import { FetchOrdersByUserIdService } from "@/services/orders/fetch-by-user-id.ts";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export class OrdersController {
  constructor(
    private ordersRepository: IOrdersRepository,
    private usersRepository: IUsersRepository,
    private productsRepository: IProductsRepository
  ) { }

  async changeStatus(req: Request, res: Response) {
    const paramsSchema = z.object({
      id: z.uuid()
    });

    const bodySchema = z.object({
      status: z.enum([
        "QUEUE", "COMPLETED", "CANCELED", "WAY", "PREPARING"
      ])
    });

    const { id } = paramsSchema.parse(req.params);
    const { status } = bodySchema.parse(req.body);

    const changeOrderStatusService = new ChangeOrderStatusService(this.ordersRepository);
    await changeOrderStatusService.execute({
      id,
      newStatus: status
    });

    return res.status(StatusCodes.NO_CONTENT).end();
  }

  async create(req: Request, res: Response) {
    const bodySchema = z.array(z.object({
      productId: z.uuid(),
      productPrice: z.number(),
      quantity: z.number()
    })).nonempty();

    const items = bodySchema.parse(req.body);

    const createOrderService = new CreateOrderService(
      this.ordersRepository,
      this.usersRepository,
      this.productsRepository
    );

    await createOrderService.execute({
      items,
      userId: req.userId
    });

    return res.status(StatusCodes.CREATED).end();
  }

  async fetchAll(_req: Request, res: Response) {
    const fetchAllOrdersService = new FetchAllOrdersService(this.ordersRepository);
    const orders = await fetchAllOrdersService.execute();

    return res.status(StatusCodes.OK).json(orders);
  }

  async fetchByUserId(req: Request, res: Response) {
    const paramsSchema = z.object({
      page: z.number()
    });

    const { page } = paramsSchema.parse(req.params);

    const fetchOrdersByUserIdService = new FetchOrdersByUserIdService(
      this.ordersRepository,
      this.usersRepository
    );

    const orders = await fetchOrdersByUserIdService.execute({
      userId: req.userId,
      page
    });

    return res.status(StatusCodes.OK).json(orders);
  }
}