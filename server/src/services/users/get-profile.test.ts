import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserProfileService } from "./get-profile.ts";
import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";

describe("Get User Profile Service", () => {
  let usersRepository: IUsersRepository;
  let sut: GetUserProfileService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileService(usersRepository);
  });

  it("should be able to get user profile", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const userProfile = await sut.execute({ userId: user.id });

    expect(userProfile).toEqual(user);
  });

  it("should not be able to get user profile with invalid user id", async () => {
    await expect(() =>
      sut.execute({ userId: "invalid-id" }))
      .rejects
      .toBeInstanceOf(ResourceNotFoundError);
  });
});