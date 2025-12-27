import { db } from "@/database/index.ts";
import { DrizzleUsersRepository } from "@/repositories/drizzle/drizzle-users-repository.ts";
import { GetUserProfileService } from "@/services/users/get-profile.ts";
import type { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

export async function adminVerify(req: Request, res: Response, next: NextFunction) {
  const { userId } = req;
  const usersRepository = new DrizzleUsersRepository(db);
  const getUserProfileService = new GetUserProfileService(usersRepository);
  const user = await getUserProfileService.execute({ userId });

  if (!user || !user.isAdmin)
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Unauthorized" });

  return next();
}