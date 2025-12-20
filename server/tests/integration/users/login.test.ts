import { InvalidCredentialsError } from '@/errors/InvalidCredentialsError.ts';
import { DrizzleUsersRepository } from '@/repositories/drizzle/drizzle-users-repository.ts';
import { LoginUserService } from '@/services/users/login.ts';
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { hashPassword } from '@/utils/password-hash.ts';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';

describe("Login User Service (Integration)", () => {
  let usersRepository: DrizzleUsersRepository;
  let sut: LoginUserService;

  beforeEach(async () => {
    await resetDatabase();

    usersRepository = new DrizzleUsersRepository(db);
    sut = new LoginUserService(usersRepository);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to login a user", async () => {
    const phone = "(01) X2345-6789";
    const password = "123456";

    const createdUser = await usersRepository.create(phone, await hashPassword(password), false);
    const loggedUser = await sut.execute({ phone, password });

    expect(loggedUser).toEqual(createdUser);
  });

  it("should not be able to login with incorrect phone", async () => {
    const phone = "(01) X2345-6789";
    const wrongPhone = "(10) Y2345-6789";
    const password = "123456";

    await usersRepository.create(phone, await hashPassword(password), false);

    await expect(() =>
      sut.execute({ phone: wrongPhone, password })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to login with incorrect password", async () => {
    const phone = "(01) X2345-6789";
    const password = "123456";
    const wrongPassword = "1@3456";

    await usersRepository.create(phone, await hashPassword(password), false);

    await expect(() =>
      sut.execute({ phone, password: wrongPassword })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
