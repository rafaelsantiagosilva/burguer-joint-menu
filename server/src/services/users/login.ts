import { InvalidCredentialsError } from "@/errors/InvalidCredentialsError.ts";
import type { User } from "@/models/user.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

export class LoginUserService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user || user.password !== password)
      throw new InvalidCredentialsError();

    return user;
  }
} 
