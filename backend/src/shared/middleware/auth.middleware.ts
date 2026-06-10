import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';
import { User } from '@/shared/models/User.model';
import { Company } from '@/shared/models/Company.model';

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
      res.status(401).json({
        status: 'error',
        message: 'Không tìm thấy xác thực (Token bị thiếu hoặc sai định dạng)',
      });
      return;
    }

    // Remove "Bearer " to get token
    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);

    if (typeof decoded === 'string' || !decoded) {
      res.status(401).json({ status: 'error', message: 'Token không hợp lệ' });
      return;
    }

    const userId = decoded.id as string;
    const role = decoded.role as string;

    // Check account status if it is a user or company
    if (role === 'customer') {
      const userObj = await User.findById(userId).select('status lock_reason').exec();
      if (!userObj) {
        res.status(401).json({ status: 'error', message: 'Tài khoản không tồn tại' });
        return;
      }
      if (userObj.status === 'locked') {
        res.status(403).json({
          status: 'error',
          message: `Tài khoản của bạn đã bị khóa. Lý do: ${userObj.lock_reason || 'Không rõ lý do'}`,
          code: 'USER_LOCKED',
        });
        return;
      }
    } else if (role === 'company') {
      const companyObj = await Company.findById(userId).select('status lock_reason').exec();
      if (!companyObj) {
        res.status(401).json({ status: 'error', message: 'Tài khoản công ty không tồn tại' });
        return;
      }
      if (companyObj.status === 'locked') {
        res.status(403).json({
          status: 'error',
          message: `Tài khoản công ty của bạn đã bị khóa. Lý do: ${companyObj.lock_reason || 'Không rõ lý do'}`,
          code: 'COMPANY_LOCKED',
        });
        return;
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
    // If token is expired
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ status: 'error', message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
      return;
    }

    // If token is invalid
    res.status(401).json({ status: 'error', message: 'Token không hợp lệ' });
  }
};
