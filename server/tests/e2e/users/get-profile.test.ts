import { app } from "@/app.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("User (E2E) - GET /users/profile", () => {
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });


  it("should be able to get user profile", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const token = makeJwt(user.id);

    const response = await request(app).get("/users/profile").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toEqual(expect.objectContaining({
      name: user.name,
      address: user.address,
      phone: user.phone,
      isAdmin: user.isAdmin
    }));
  });

  it("should return a UNAUTHORIZED code if user is not authenticated", async () => {
    const response = await request(app).get("/users/profile");
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should return a UNAUTHORIZED code if token is invalid", async () => {
    const response = await request(app).get("/users/profile").set("Authorization", "Bearer invalid-token");
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should return a NOT FOUND code if user does not exist", async () => {
    const invalidUserId = crypto.randomUUID();
    const token = makeJwt(invalidUserId);
    const response = await request(app).get("/users/profile").set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });
});
