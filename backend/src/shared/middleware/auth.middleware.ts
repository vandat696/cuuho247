import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.util';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    [key: string]: unknown;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
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

    // Save data to request
    req.user = {
      id: decoded.id as string,
      role: decoded.role as string,
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
