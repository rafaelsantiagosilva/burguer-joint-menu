import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.ts";

export class WithoutProductsError extends AppError {
  constructor() {
    super("An order must have at least one product.", StatusCodes.BAD_REQUEST);
  }
}