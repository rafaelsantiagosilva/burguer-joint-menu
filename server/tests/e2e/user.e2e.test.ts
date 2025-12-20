import { app } from "@/app.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { db, resetDatabase } from "../setup/db.ts";
import { StatusCodes } from "http-status-codes";

describe("User (E2E)", () => {
  let usersRepository: DrizzleUsersRepository;

  beforeEach(async () => {
    await resetDatabase();
    usersRepository = new DrizzleUsersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  describe("GET /users/profile", () => {
    it("should be able to get user profile", async () => {
      const user = await usersRepository.create("(01) X2345-6789", "123456", false);
      const token = makeJwt(user.id);

      console.log(token);

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

  // describe("POST /users/register", () => { });

  // describe("POST /users/login", () => { });

  // describe("PATCH /users/add-name-and-address", () => { });

  // describe("PUT /users/update-profile", () => { });
});