import { app } from "@/app.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("User (E2E) - POST /users/register", () => {
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to register a new user", async () => {
    const response = await request(app).post("/users/register").send({
      phone: "(01) X2345-6789",
      password: "123456"
    });

    expect(response.status).toBe(StatusCodes.CREATED);
  });

  it("should not be able to register a new user with same phone", async () => {
    const samePhone = "(01) X2345-6789";

    await request(app).post("/users/register").send({
      phone: samePhone,
      password: "123456"
    });

    const response = await request(app).post("/users/register").send({
      phone: samePhone,
      password: "123456"
    });

    expect(response.status).toBe(StatusCodes.CONFLICT);
  });

  it("should not be able to register a new user with one or more invalid fields", async () => {
    const response = await request(app).post("/users/register").send({
      phone: "(01) X2345-6789",
      password: "123" // minimum password length is 6
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
