import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts";
import { comparePassword } from "@/utils/password-hash.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUserService } from "./register.ts";

describe("Register User Service", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: RegisterUserService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserService(usersRepository);
  });

  it("should to be able register a new user", async () => {
    const user = await sut.execute("test@email.com", "123456");
    expect(user.id).toBeTruthy();
  });

  it("should hash user password upon registration", async () => {
    const user = await sut.execute("test@email.com", "123456");
    expect(user.password).not.toBe("123456");

    const passwordMatch = await comparePassword("123456", user.password);
    expect(passwordMatch).toBe(true);
  });

  it("shouldn't to be able register a new user with same email", async () => {
    const email = "test@email.com";

    await sut.execute(email, "123456");
    await expect(() =>
      sut.execute(email, "123456")
    ).rejects.toBeInstanceOf(Error);
  });
});