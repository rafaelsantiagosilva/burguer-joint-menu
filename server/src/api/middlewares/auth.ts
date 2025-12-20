import { env } from "@/env.ts";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export function auth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization ?? "";

  if (!authHeader)
    return res.status(StatusCodes.UNAUTHORIZED).end();

  const [_, token] = authHeader.split(" ");

  jwt.verify(token!, env.JWT_SECRET, (error, decodedToken) => {
    if (error)
      return res.status(401).json({ message: "Invalid token" });

    const { userId } = decodedToken as { userId: string };
    req.userId = userId;
  });

  next();
}