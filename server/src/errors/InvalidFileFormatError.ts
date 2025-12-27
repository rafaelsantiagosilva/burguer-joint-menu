import { StatusCodes } from "http-status-codes";
import { AppError } from "./AppError.ts";

export class InvalidFileFormatError extends AppError {
  constructor() {
    super("Invalid file format. Only image (png,jpgm,jpeg) files are allowed.", StatusCodes.BAD_REQUEST);
  }
}