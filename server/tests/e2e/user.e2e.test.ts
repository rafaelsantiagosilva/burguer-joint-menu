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

  describe("POST /users/register", () => {
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

  describe("POST /users/login", () => {
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

  describe("PATCH /users/add-address-and-name", () => {
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

  describe("PUT /users/update-profile", () => {
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
});