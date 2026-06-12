import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { User } from '@/shared/models/User.model';
import { Company } from '@/shared/models/Company.model';
import { AppError, UnauthorizedError, ForbiddenError } from '../utils/apiError.util';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    [key: string]: unknown;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Không tìm thấy xác thực (Token bị thiếu hoặc sai định dạng)');
    }

    // Remove "Bearer " to get token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    if (typeof decoded === 'string' || !decoded) {
      throw new UnauthorizedError('Token không hợp lệ');
    }

    const userId = decoded.id as string;
    const role = decoded.role as string;

    // Check account status if it is a user or company
    if (role === 'customer') {
      const userObj = await User.findById(userId).select('status lock_reason').exec();
      if (!userObj) {
        throw new UnauthorizedError('Tài khoản không tồn tại');
      }
      if (userObj.status === 'locked') {
        throw new ForbiddenError(
          `Tài khoản của bạn đã bị khóa. Lý do: ${userObj.lock_reason || 'Không rõ lý do'}`,
          'USER_LOCKED'
        );
      }
    } else if (role === 'company') {
      const companyObj = await Company.findById(userId).select('status lock_reason').exec();
      if (!companyObj) {
        throw new UnauthorizedError('Tài khoản công ty không tồn tại');
      }
      if (companyObj.status === 'locked') {
        throw new ForbiddenError(
          `Tài khoản công ty của bạn đã bị khóa. Lý do: ${companyObj.lock_reason || 'Không rõ lý do'}`,
          'COMPANY_LOCKED'
        );
      }
    }

    // Save data to request
    req.user = {
      id: userId,
      role: role,
      ...decoded,
    };

    // Continue to controller
    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    // If token is expired
    if (error.name === 'TokenExpiredError') {
      next(new UnauthorizedError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'));
      return;
    }

    // If token is invalid
    next(new UnauthorizedError('Token không hợp lệ'));
  }
};
