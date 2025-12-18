import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { AddAddressAndNameUserService } from "@/services/users/add-address-and-name.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Add Address And Name User Service (Integration)", () => {
  let usersRepository: DrizzleUsersRepository;
  let sut: AddAddressAndNameUserService;

  beforeEach(async () => {
    await resetDatabase();

    usersRepository = new DrizzleUsersRepository(db);
    sut = new AddAddressAndNameUserService(usersRepository);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to add address and name to an user", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    await sut.execute({ userId: user.id, address: "123 Main St", name: "John Doe" });

    const updatedUser = await usersRepository.findById(user.id);

    expect(updatedUser).toBeDefined();
    expect(updatedUser?.address).toBe("123 Main St");
    expect(updatedUser?.name).toBe("John Doe");
  });
});
