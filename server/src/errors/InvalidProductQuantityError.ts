import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.ts";

export class InvalidProductQuantityError extends AppError {
  constructor() {
    super(
      "One or more products in the order have an invalid quantity.",
      StatusCodes.BAD_REQUEST,
    );
  }
}