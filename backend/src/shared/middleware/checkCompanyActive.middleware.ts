import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import companyRepository from '@/modules/company/company.repository';
import { NotFoundError, ForbiddenError } from '../utils/apiError.util';

export const checkCompanyActive = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user && req.user.role === 'company') {
      const company = await companyRepository.findById(req.user.id);
      if (!company) {
        throw new NotFoundError('Không tìm thấy thông tin công ty');
      }

      if (company.status !== 'active') {
        const message =
          company.status === 'pending_verification'
            ? 'Tài khoản của bạn đang chờ xác minh. Vui lòng đợi quản trị viên phê duyệt hồ sơ.'
            : company.status === 'rejected'
              ? 'Tài khoản của bạn đã bị từ chối xác minh.'
              : 'Tài khoản của bạn đã bị khóa.';
        throw new ForbiddenError(message, 'COMPANY_NOT_ACTIVE');
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
