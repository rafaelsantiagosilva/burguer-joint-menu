import { UserAlreadyExistsError } from "@/errors/UserAlreadyExistsError.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

type AddAddressAndNameUserRequest = {
  userId: string;
  address: string;
  name: string;
}

type AddAddressAndNameUserResponse = void;

export class AddAddressAndNameUserService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({ userId, address, name }: AddAddressAndNameUserRequest): Promise<AddAddressAndNameUserResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user)
      throw new UserAlreadyExistsError();

    await this.usersRepository.update({ ...user, address, name });
  }
}