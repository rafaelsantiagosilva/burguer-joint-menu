import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { Router } from "express";
import { UsersController } from "../controllers/users-controller.ts";
import { auth } from "../middlewares/auth.ts";
import type IOrdersRepository from "@/repositories/IOrdersRepository.ts";

export class UserRouter {
  public routes: Router = Router();
  private usersController: UsersController | null = null;

  constructor(private usersRepository: IUsersRepository, private ordersRepository: IOrdersRepository) {
    this.usersController = new UsersController(this.usersRepository, this.ordersRepository);

    this.routes.get("/profile", auth, this.usersController.getProfile.bind(this.usersController));
    this.routes.get("/orders/:page", auth, this.usersController.getOrders.bind(this.usersController));
    this.routes.post("/register", this.usersController.register.bind(this.usersController));
    this.routes.post("/login", this.usersController.login.bind(this.usersController));
    this.routes.patch("/add-address-and-name", auth, this.usersController.addAddressAndName.bind(this.usersController));
    this.routes.put("/update-profile", auth, this.usersController.updateProfile.bind(this.usersController));
  }
}
