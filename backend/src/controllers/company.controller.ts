import { Request, Response, NextFunction } from 'express';
import companyRepository from '../repositories/company.repository';
import { ApiError } from '../utils/apiError.util';

class CompanyController {
  async getCompanyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      if (!companyId) {
        throw new ApiError(400, 'Company ID is required');
      }

      const company = await companyRepository.findById(companyId);
      if (!company) {
        throw new ApiError(404, 'Company not found');
      }

      const { password_hash: _passwordHash, ...companyData } = company.toObject();
      res.status(200).json({
        status: 'success',
        message: 'Company information retrieved successfully',
        data: companyData,
      });
    } catch (err: unknown) {
      next(err);
    }
  }
}

export default new CompanyController();
