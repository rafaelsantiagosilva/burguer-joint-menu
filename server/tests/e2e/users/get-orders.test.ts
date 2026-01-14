import { app } from "@/app.ts";
import { DrizzleOrdersRepository } from "@/repositories/drizzle/drizzle-orders-repository.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { db, resetDatabase } from "@/tests/setup/db.ts";
import { makeJwt } from "@/utils/make-jwt.ts";
import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

describe("User (E2E) - GET /users/orders/:page", () => {
  let usersRepository: DrizzleUsersRepository;
  let ordersRepository: DrizzleOrdersRepository

  beforeEach(async () => {
    await resetDatabase();
    usersRepository = new DrizzleUsersRepository(db);
    ordersRepository = new DrizzleOrdersRepository(db);
  });

  afterAll(async () => {
    await resetDatabase();
  });

  it("should be able to get user orders", async () => {
    const user = await usersRepository.create("(01) X2345-6789", "123456", false);
    const token = makeJwt(user.id);

    for (let i = 0; i < 5; i++)
      await ordersRepository.create(user.id, []);

    const response = await request(app).get("/users/orders/1").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveLength(5);
  });

  it("should return a UNAUTHORIZED code if user is not authenticated", async () => {
    const response = await request(app).get("/users/orders/1");
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should return a UNAUTHORIZED code if token is invalid", async () => {
    const response = await request(app).get("/users/orders/1").set("Authorization", "Bearer invalid-token");
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
