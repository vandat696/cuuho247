import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';

export const authorize = (allowedRoles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void | Response => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        status: 'error',
        message: 'Forbidden: Insufficient permissions',
      });
    }

    next();
  };
};
