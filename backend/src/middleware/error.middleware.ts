import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.util';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // If error is ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // If system error
  console.error('[System Error]:', err);
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
