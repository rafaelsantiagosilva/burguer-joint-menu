import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type { User } from "@/models/user.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

type UpdateUserProfileServiceRequest = User;

type UpdateUserProfileServiceResponse = void;

export class UpdateUserProfileService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute(user: UpdateUserProfileServiceRequest): Promise<UpdateUserProfileServiceResponse> {
    const userExists = await this.usersRepository.findById(user.id);

    if (!userExists)
      throw new ResourceNotFoundError();

    await this.usersRepository.update(user);
  }
}