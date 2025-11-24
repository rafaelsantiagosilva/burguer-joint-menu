import { beforeEach, describe, expect, it } from "vitest";
import { AddAddressAndNameUserService } from "./add-address-and-name.ts";
import type IUsersRepository from "@/repositories/IUsersRepository.ts";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts";

describe("Add Address And Name User Service", () => {
  let usersRepository: IUsersRepository;
  let sut: AddAddressAndNameUserService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new AddAddressAndNameUserService(usersRepository);
  });

  it("should be able to add address and name to an user", async () => {
    const user = await usersRepository.create("test@email.com", "123456", false);
    await sut.execute(user.id, "123 Main St", "John Doe");

    const updatedUser = await usersRepository.findById(user.id);

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.address).toBe("123 Main St");
    expect(updatedUser?.name).toBe("John Doe");
  });
});
