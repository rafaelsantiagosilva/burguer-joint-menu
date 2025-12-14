import { env } from "@/env.ts";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization ?? "";

  if (!jwt.verify(authHeader, env.JWT_SECRET))
    return res.status(StatusCodes.UNAUTHORIZED).end();

  next();
}