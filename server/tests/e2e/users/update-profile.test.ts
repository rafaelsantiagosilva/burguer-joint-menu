
import { app } from "@/app.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("User (E2E) - PUT /users/update-profile", () => {
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to update user profile", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const token = makeJwt(user.id);

    const response = await request(app).put("/users/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        phone: "(01) X2345-6789",
        password: "123456",
        address: "123 Main St, Downtown, 010, Ap 100",
        isAdmin: true
      });

    const updatedUser = await usersRepository.findById(user.id);

    expect(response.status).toBe(StatusCodes.NO_CONTENT);
    expect(updatedUser).toEqual(expect.objectContaining({
      name: "John Doe",
      address: "123 Main St, Downtown, 010, Ap 100",
      isAdmin: true
    }));
  });

  it("should not be able to update profile of a inexisting user", async () => {
    const invalidUserId = crypto.randomUUID();
    const token = makeJwt(invalidUserId);

    const response = await request(app).put("/users/update-profile")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        phone: "(01) X2345-6789",
        password: "123456",
        address: "123 Main St, Downtown, 010, Ap 100",
        isAdmin: true
      });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should not be able to update profile without a token", async () => {
    await usersRepository.create("(01) X2345-6789", "123456", false);

    const response = await request(app).put("/users/update-profile")
      .send({
        name: "John Doe",
        phone: "(01) X2345-6789",
        password: "123456",
        address: "123 Main St, Downtown, 010, Ap 100",
        isAdmin: true
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to update profile with an invalid token", async () => {
    await usersRepository.create("(01) X2345-6789", "123456", false);

    const response = await request(app).put("/users/update-profile")
      .set("Authorization", `Bearer invalid-token`)
      .send({
        name: "John Doe",
        phone: "(01) X2345-6789",
        password: "123456",
        address: "123 Main St, Downtown, 010, Ap 100",
        isAdmin: true
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});