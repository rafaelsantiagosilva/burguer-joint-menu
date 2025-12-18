import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { comparePassword } from "@/utils/password-hash.ts";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { RegisterUserService } from "@/services/users/register.ts";
import { resetDatabase } from "@/tests/setup/db.ts";

describe("Register User Service (Integration)", () => {
  let usersRepository: DrizzleUsersRepository;
  let sut: RegisterUserService;

  beforeEach(async () => {
    await resetDatabase();

    usersRepository = new DrizzleUsersRepository();
    sut = new RegisterUserService(usersRepository);
  });

  afterAll(async () => {
    await resetDatabase();
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