import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { UpdateUserProfileService } from "./update-profile.ts";

describe("Update User Profile Service", () => {
  let usersRepository: IUsersRepository;
  let sut: UpdateUserProfileService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new UpdateUserProfileService(usersRepository);
  });

  it("should be able to update an user profile", async () => {
    const data = await usersRepository.create(
      "test@email.com",
      "123456",
      false
    );

    const user = await usersRepository.findById(data.id);
    await sut.execute({ ...user!, name: "John Doe", address: "123 Main St" });

    const updatedUser = await usersRepository.findById(data.id);
    expect(updatedUser).toEqual(expect.objectContaining({
      name: "John Doe",
      address: "123 Main St"
    }));
  });

  it("should not be able to update an inexistent user profile", async () => {
    await expect(() =>
      sut.execute({
        id: "invalid-id",
        name: "John Doe",
        address: "123 Main St",
        email: "test@email.com",
        password: "123456",
        isAdmin: false
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  })
});