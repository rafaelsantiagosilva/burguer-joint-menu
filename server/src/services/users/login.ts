import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError.ts";
import type { User } from "@/models/user.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

type LoginUserRequest = {
  email: string;
  password: string;
}

type LoginUserResponse = User;

export class LoginUserService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({ email, password }: LoginUserRequest): Promise<LoginUserResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user || user.password !== password)
      throw new InvalidCredentialsError();

    return user;
  }
} 
