import { NextFunction, Response } from 'express';
import { AuthRequest } from './auth.middleware';
import { ForbiddenError } from '../utils/apiError.util';

export const authorize = (allowedRoles: string[] = []) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      throw new ForbiddenError('Forbidden: Insufficient permissions');
    }

    next();
  };
};
