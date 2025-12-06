import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import type { User } from "@/models/user.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";

type GetUserProfileServiceRequest = {
  userId: string;
}

type GetUserProfileServiceResponse = User;

export class GetUserProfileService {
  constructor(private usersRepository: IUsersRepository) { }

  async execute({ userId }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user)
      throw new ResourceNotFoundError();

    return user;
  }
}