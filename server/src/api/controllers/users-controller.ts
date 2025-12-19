import { env } from "@/env.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { AddAddressAndNameUserService } from "@/services/users/add-address-and-name.ts";
import { GetUserProfileService } from "@/services/users/get-profile.ts";
import { LoginUserService } from "@/services/users/login.ts";
import { RegisterUserService } from "@/services/users/register.ts";
import { UpdateUserProfileService } from "@/services/users/update-profile.ts";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { z } from "zod";

export class UsersController {
  constructor(private usersRepository: IUsersRepository) { }

  async getProfile(req: Request, res: Response) {
    const { userId } = req;

    const getUserProfileService = new GetUserProfileService(this.usersRepository);

    const { name, address, phone, isAdmin } = await getUserProfileService.execute({ userId });
    return res.status(StatusCodes.ACCEPTED)
      .send({
        name,
        address,
        phone,
        isAdmin
      });
  }

  async register(req: Request, res: Response) {
    const bodySchema = z.object({
      phone: z.string(),
      password: z.string().min(6)
    });

    const { phone, password } = bodySchema.parse(req.body);
    const registerUserService = new RegisterUserService(this.usersRepository);

    await registerUserService.execute({ phone, password });
    res.status(StatusCodes.CREATED).send({ message: "User created" });
  }

  async login(req: Request, res: Response) {
    const bodySchema = z.object({
      phone: z.string(),
      password: z.string().min(6)
    });

    const { phone, password } = bodySchema.parse(req.body);
    const loginService = new LoginUserService(this.usersRepository);

    const { id } = await loginService.execute({ phone, password });
    const token = jwt.sign({ id }, env.JWT_SECRET, { expiresIn: '1h' });

    res.status(StatusCodes.OK).send({ token });
  }

  async addNameAndAddress(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string(),
      address: z.string(),
      neighborhood: z.string(),
      homeNumber: z.string(),
      complement: z.string().optional(),
    });

    const { name,
      address,
      neighborhood,
      homeNumber,
      complement
    } = bodySchema.parse(req.body);

    const addAddressAndNameService = new AddAddressAndNameUserService(this.usersRepository);

    const userAddress = `
      ${address},
      ${neighborhood},
      ${homeNumber} ${complement ? `, ${complement}` : ""}
    `.trim();

    await addAddressAndNameService.execute({ userId: req.userId, address: userAddress, name });
    res.status(StatusCodes.NO_CONTENT).end();
  }

  async updateProfile(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().nullable(),
      phone: z.string(),
      password: z.string(),
      address: z.string().nullable(),
      isAdmin: z.boolean()
    });

    const user = bodySchema.parse(req.body);
    const updateUserProfileService = new UpdateUserProfileService(this.usersRepository);

    await updateUserProfileService.execute({ id: req.userId, ...user });
    res.status(StatusCodes.NO_CONTENT).end();
  }
}