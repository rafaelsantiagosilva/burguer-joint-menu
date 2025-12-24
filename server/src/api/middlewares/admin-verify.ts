import { db } from "@/database/index.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export async function adminVerify(req: Request, res: Response, next: NextFunction) {
  const { userId } = req;
  const usersRepository = new DrizzleUsersRepository(db);
  const user = await usersRepository.findById(userId);

  if (!user || !user.isAdmin)
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });

  return next();
}