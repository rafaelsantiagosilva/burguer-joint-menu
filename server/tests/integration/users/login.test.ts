import { InvalidCredentialsError } from '@/errors/InvalidCredentialsError.ts';
import type IUsersRepository from '@/repositories/IUsersRepository.ts';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoginUserService } from '@/services/users/login.ts';

describe("Login User Service", () => {
  let usersRepository: IUsersRepository;
  let sut: LoginUserService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new LoginUserService(usersRepository);
  });

  it("should be able to login a user", async () => {
    const phone = "(01) X2345-6789";
    const password = "123456";

    const createdUser = await usersRepository.create(phone, password, false);
    const loggedUser = await sut.execute({ phone, password });

    expect(loggedUser).toEqual(createdUser);
  });

  it("should not be able to login with incorrect phone", async () => {
    const phone = "(01) X2345-6789";
    const wrongPhone = "(10) Y2345-6789";
    const password = "123456";

    await usersRepository.create(phone, password, false);

    await expect(() =>
      sut.execute({ phone: wrongPhone, password })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to login with incorrect password", async () => {
    const phone = "(01) X2345-6789";
    const password = "123456";
    const wrongPassword = "1@3456";

    await usersRepository.create(phone, password, false);

    await expect(() =>
      sut.execute({ phone, password: wrongPassword })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
