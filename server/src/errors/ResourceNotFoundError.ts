import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.ts";

export class ResourceNotFoundError extends AppError {
  constructor() {
    super("Resource not found", StatusCodes.NOT_FOUND);
  }
}