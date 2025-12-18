import { ResourceNotFoundError } from "@/errors/ResourceNotFoundError.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { GetUserProfileService } from "@/services/users/get-profile.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("Get User Profile Service (Integration)", () => {
  let usersRepository: DrizzleUsersRepository;
  let sut: GetUserProfileService;

  beforeEach(async () => {
    await resetDatabase();

    usersRepository = new DrizzleUsersRepository(db);
    sut = new GetUserProfileService(usersRepository);
  });

  afterAll(async () => {
    await resetDatabase();
  })

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