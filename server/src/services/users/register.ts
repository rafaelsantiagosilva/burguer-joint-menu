import { UserAlreadyExistsError } from "@/errors/UserAlreadyExistsError.ts";
import type { User } from "@/models/user.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { hashPassword } from "@/utils/password-hash.ts";

export class RegisterUserService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute(email: string, password: string): Promise<User> {
    const user = await this.usersRepository.findByEmail(email);

    if (user)
      throw new UserAlreadyExistsError();

    return await this.usersRepository.register(
      email,
      await hashPassword(password),
      false
    );
  }
}