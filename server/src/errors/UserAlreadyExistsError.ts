import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.ts";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User with this email already exists.", StatusCodes.CONFLICT);
  }
}