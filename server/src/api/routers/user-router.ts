import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { Router } from "express";
import { UsersController } from "../controllers/users-controller.ts";
import { auth } from "../middlewares/auth.ts";

export class UserRouter {
  public routes: Router = Router();
  private usersController: UsersController | null = null;

  constructor(private usersRepository: IUsersRepository) {
    this.usersController = new UsersController(this.usersRepository);

    this.routes.get("/profile", auth, this.usersController.getProfile.bind(this.usersController));
    this.routes.post("/register", this.usersController.register.bind(this.usersController));
    this.routes.post("/login", this.usersController.login.bind(this.usersController));
    this.routes.patch("/add-name-and-address", auth, this.usersController.addNameAndAddress.bind(this.usersController));
    this.routes.put("/update-profile", auth, this.usersController.updateProfile.bind(this.usersController));
  }
}
