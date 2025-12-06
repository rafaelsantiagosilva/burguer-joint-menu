import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError.ts";
import type { User } from "@/models/user.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

type LoginUserRequest = {
  phone: string;
  password: string;
}

type LoginUserResponse = User;

export class LoginUserService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({ phone, password }: LoginUserRequest): Promise<LoginUserResponse> {
    const user = await this.usersRepository.findByPhone(phone);

    if (!user || user.password !== password)
      throw new InvalidCredentialsError();

    return user;
  }
} 
