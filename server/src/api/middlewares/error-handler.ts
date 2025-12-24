import { env } from "@/env.ts";
import type { AppError } from "@/errors/AppError.ts";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export function errorHandler(
  error: AppError,
  _: Request,
  res: Response,
  next: NextFunction) {
  if (env.ENV === "dev" /* || env.ENV === "test" */) {
    const icon = env.ENV === "dev" ? "❌" : "🧪";
    console.info("> ", icon, " Error handler:");
    console.error(error);
  }

  if (error instanceof ZodError) {
    const { issues } = error;

    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        error: "Validation Error",
        issues
      });
  }

  return res
    .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({
      message: error.message || "Internal Server Error",
    });
} 