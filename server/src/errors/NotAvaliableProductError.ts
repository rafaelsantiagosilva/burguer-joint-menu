import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.ts";

export class NotAvaliableProductError extends AppError {
  constructor() {
    super("One or more products in the order are not available.", StatusCodes.BAD_REQUEST);
  }
}