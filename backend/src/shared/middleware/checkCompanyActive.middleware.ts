import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import companyRepository from '@/modules/company/company.repository';

export const checkCompanyActive = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.user && req.user.role === 'company') {
      const company = await companyRepository.findById(req.user.id);
      if (!company) {
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy thông tin công ty',
        });
        return;
      }

      if (company.status !== 'active') {
        res.status(403).json({
          status: 'error',
          code: 'COMPANY_NOT_ACTIVE',
          message:
            company.status === 'pending_verification'
              ? 'Tài khoản của bạn đang chờ xác minh. Vui lòng đợi quản trị viên phê duyệt hồ sơ.'
              : company.status === 'rejected'
                ? 'Tài khoản của bạn đã bị từ chối xác minh.'
                : 'Tài khoản của bạn đã bị khóa.',
          companyStatus: company.status,
        });
        return;
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};
