import { InvalidCredentialsError } from '@/errors/InvalidCredentialsError.ts';
import type IUsersRepository from '@/repositories/IUsersRepository.ts';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.ts';
import { beforeEach, describe, expect, it } from 'vitest';
import { LoginUserService } from './login.ts';

describe("Login User Service", () => {
  let usersRepository: IUsersRepository;
  let sut: LoginUserService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new LoginUserService(usersRepository);
  });

  it("should be able to login a user", async () => {
    const email = "test@email.com";
    const password = "123456";

    const createdUser = await usersRepository.create(email, password, false);
    const loggedUser = await sut.execute({ email, password });

    expect(loggedUser).toEqual(createdUser);
  });

  it("should not be able to login with incorrect email", async () => {
    const email = "test@email.com";
    const wrongEmail = "wrong@email.com";
    const password = "123456";

    await usersRepository.create(email, password, false);

    await expect(() =>
      sut.execute({ email: wrongEmail, password })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to login with incorrect password", async () => {
    const email = "test@email.com";
    const password = "123456";
    const wrongPassword = "1@3456";

    await usersRepository.create(email, password, false);

    await expect(() =>
      sut.execute({ email, password: wrongPassword })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
