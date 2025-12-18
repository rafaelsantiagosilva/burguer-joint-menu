import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { UpdateUserProfileService } from "@/services/users/update-profile.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Update User Profile Service (Integration)", () => {
  let usersRepository: DrizzleUsersRepository;
  let sut: UpdateUserProfileService;

  beforeEach(async () => {
    await resetDatabase()

    usersRepository = new DrizzleUsersRepository(db);
    sut = new UpdateUserProfileService(usersRepository);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to update an user profile", async () => {
    const data = await usersRepository.create(
      "(01) X2345-6789",
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
        phone: "(01) X2345-6789",
        password: "123456",
        isAdmin: false
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError);
  })
});