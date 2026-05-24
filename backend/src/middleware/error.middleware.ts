import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ApiError } from '../utils/apiError.util';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  // If error is ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'Ảnh không được vượt quá 5MB' : err.message;
    return res.status(400).json({
      status: 'error',
      message,
    });
  }

  if (err.message === 'Chỉ hỗ trợ upload ảnh JPG, PNG hoặc WEBP') {
    return res.status(400).json({
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
