import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.ts";

export class InvalidProductPriceError extends AppError {
  constructor() {
    super(
      "One or more products in the order have an invalid price.",
      StatusCodes.BAD_REQUEST,
    );
  }
}