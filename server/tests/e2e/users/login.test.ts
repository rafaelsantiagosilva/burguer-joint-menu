import { app } from "@/app.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("User (E2E) - POST /users/login", () => {
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to login a user", async () => {
    const phone = "(01) X2345-6789";
    const password = "123456";

    await request(app).post("/users/register").send({
      phone,
      password
    });

    const user = await usersRepository.findByPhone("(01) X2345-6789");

    const response = await request(app).post("/users/login").send({
      phone,
      password
    });

    const responseToken = response.body.token;
    const expectedToken = makeJwt(user!.id);

    expect(response.status).toBe(StatusCodes.OK);
    expect(responseToken).toBe(expectedToken);
  });

  it("should not be able to login a user with the invalid phone", async () => {
    const response = await request(app).post("/users/login").send({
      phone: "(01) X2345-6789",
      password: "123456"
    });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to login a user with the invalid password", async () => {
    const phone = "(01) X2345-6789";
    const password = "123456";

    await request(app).post("/users/register").send({
      phone,
      password
    });

    const invalidPassword = "123";

    const response = await request(app).post("/users/login").send({
      phone,
      password: invalidPassword
    });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});