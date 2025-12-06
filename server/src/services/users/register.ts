import { UserAlreadyExistsError } from "@/errors/UserAlreadyExistsError.ts";
import type { User } from "@/models/user.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { hashPassword } from "@/utils/password-hash.ts";

type RegisterUserRequest = {
  phone: string;
  password: string;
}

type RegisterUserResponse = User;

export class RegisterUserService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({ phone, password }: RegisterUserRequest): Promise<RegisterUserResponse> {
    const user = await this.usersRepository.findByPhone(phone);

    if (user)
      throw new UserAlreadyExistsError();

    return await this.usersRepository.create(
      phone,
      await hashPassword(password),
      false
    );
  }
}