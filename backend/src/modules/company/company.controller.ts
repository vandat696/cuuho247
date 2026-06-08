import { Request, Response, NextFunction } from 'express';
import companyService from './company.service';

class CompanyController {
  async getCompanyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const companyData = await companyService.getCompanyById(companyId);

      res.status(200).json({
        status: 'success',
        message: 'Company information retrieved successfully',
        data: companyData,
      });
    } catch (err: unknown) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // User is verified in authenticate middleware
      // req.user contains the decoded token payload
      const companyId = req.user?.id;
      if (!companyId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      const companyData = await companyService.getCompanyById(companyId);
      res.status(200).json({
        status: 'success',
        data: companyData,
      });
    } catch (err: unknown) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.id;
      if (!companyId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      const updateData = req.body;
      const updatedCompany = await companyService.updateCompanyProfile(companyId, updateData);

      res.status(200).json({
        status: 'success',
        message: 'Company profile updated successfully',
        data: updatedCompany,
      });
    } catch (err: unknown) {
      next(err);
    }
  }
}

export default new CompanyController();
