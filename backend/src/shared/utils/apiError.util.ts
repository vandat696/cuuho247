import { ErrorCode } from '../constants/error.constant';

export class AppError extends Error {
  statusCode: number;
  errorCode: ErrorCode;
  errors?: any[];

  constructor(statusCode: number, message: string, errorCode: ErrorCode = 'INTERNAL_ERROR', errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const ApiError = AppError;

export class BadRequestError extends AppError {
  constructor(message: string, errorCode: ErrorCode = 'BAD_REQUEST', errors?: any[]) {
    super(400, message, errorCode, errors);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, errorCode: ErrorCode = 'NOT_FOUND') {
    super(404, message, errorCode);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized', errorCode: ErrorCode = 'UNAUTHORIZED') {
    super(401, message, errorCode);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden', errorCode: ErrorCode = 'FORBIDDEN') {
    super(403, message, errorCode);
  }
}

export class ConflictError extends AppError {
  constructor(message: string, errorCode: ErrorCode = 'CONFLICT') {
    super(409, message, errorCode);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error', errorCode: ErrorCode = 'INTERNAL_ERROR') {
    super(500, message, errorCode);
  }
}
