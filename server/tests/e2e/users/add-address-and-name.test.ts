import { app } from "@/app.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";


describe("User (E2E) - PATCH /users/add-address-and-name", () => {
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to update user name and address", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const token = makeJwt(user.id);

    const response = await request(app).patch("/users/add-address-and-name")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        address: "123 Main St",
        neighborhood: "Downtown",
        homeNumber: "010",
        complement: "Ap 100"
      });

    const updatedUser = await usersRepository.findById(user.id);

    expect(response.status).toBe(StatusCodes.NO_CONTENT);
    expect(updatedUser).toEqual(expect.objectContaining({
      name: "John Doe",
      address: "123 Main St, Downtown, 010, Ap 100",
    }));
  });

  it("should not be able to update name and address of a inexisting user", async () => {
    const invalidUserId = crypto.randomUUID();
    const token = makeJwt(invalidUserId);

    const response = await request(app).patch("/users/add-address-and-name")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "John Doe",
        address: "123 Main St",
        neighborhood: "Downtown",
        homeNumber: "010",
        complement: "Ap 100"
      });

    expect(response.status).toBe(StatusCodes.NOT_FOUND);
  });

  it("should not be able to update name and address without a token", async () => {
    await usersRepository.create("(01) X2345-6789", "123456", false);

    const response = await request(app).patch("/users/add-address-and-name")
      .send({
        name: "John Doe",
        address: "123 Main St",
        neighborhood: "Downtown",
        homeNumber: "010",
        complement: "Ap 100"
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to update name and address with an invalid token", async () => {
    await usersRepository.create("(01) X2345-6789", "123456", false);

    const response = await request(app).patch("/users/add-address-and-name")
      .set("Authorization", `Bearer invalid-token`)
      .send({
        name: "John Doe",
        address: "123 Main St",
        neighborhood: "Downtown",
        homeNumber: "010",
        complement: "Ap 100"
      });

    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should not be able to update name and address with one or more invalid fields", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const token = makeJwt(user.id);

    const response = await request(app).patch("/users/add-address-and-name")
      .set("Authorization", `Bearer ${token}`)
      .send({
        address: "123 Main St",
        homeNumber: "010",
        complement: "Ap 100"
      });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
