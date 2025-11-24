import { UserAlreadyExistsError } from "@/errors/UserAlreadyExistsError.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

export class AddAddressAndNameUserService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute(userId: string, address: string, name: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);

    if (!user)
      throw new UserAlreadyExistsError();

    return await this.usersRepository.addAddressAndName(userId, address, name);
  }
}