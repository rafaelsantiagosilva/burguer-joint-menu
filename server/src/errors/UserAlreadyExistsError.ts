import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.ts";

export class UserAlreadyExistsError extends AppError {
  constructor() {
    super("User with this phone already exists.", StatusCodes.CONFLICT);
  }
}