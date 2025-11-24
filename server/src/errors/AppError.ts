import { StatusCodes } from 'http-status-codes';

export abstract class AppError extends Error {
  constructor(public message: string, public statusCode: StatusCodes) {
    super(message);
    this.statusCode = statusCode;
  }
}