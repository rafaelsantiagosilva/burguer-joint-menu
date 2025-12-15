import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.ts";
import { comparePassword } from "@/utils/password-hash.ts";
import { beforeEach, describe, expect, it } from "vitest";
import { RegisterUserService } from "@/services/users/register.ts";

describe("Register User Service", () => {
  let usersRepository: InMemoryUsersRepository;
  let sut: RegisterUserService;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUserService(usersRepository);
  });

  it("should to be able register a new user", async () => {
    const user = await sut.execute({ phone: "(01) X2345-6789", password: "123456" });
    expect(user.id).toBeTruthy();
  });

  it("should hash user password upon registration", async () => {
    const user = await sut.execute({ phone: "(01) X2345-6789", password: "123456" });
    expect(user.password).not.toBe("123456");

    const passwordMatch = await comparePassword("123456", user.password);
    expect(passwordMatch).toBe(true);
  });

  it("shouldn't to be able register a new user with same phone", async () => {
    const phone = "(01) X2345-6789";

    await sut.execute({ phone, password: "123456" });
    await expect(() =>
      sut.execute({ phone, password: "123456" })
    ).rejects.toBeInstanceOf(Error);
  });
});