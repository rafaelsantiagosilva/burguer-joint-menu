import { AppError } from "@/errors/AppError.ts";
import { StatusCodes } from "http-status-codes";

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Invalid email or password.", StatusCodes.UNAUTHORIZED);
  }
}