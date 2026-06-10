import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
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

  async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
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

  async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.id;
      if (!companyId) {
        res.status(401).json({ status: 'error', message: 'Unauthorized' });
        return;
      }

      const licenseFileUrl = req.file
        ? `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(req.file.filename)}`
        : undefined;

      const updateData = {
        ...req.body,
        ...(licenseFileUrl ? { license_url: licenseFileUrl } : {}),
      };

      if (req.body.latitude && req.body.longitude) {
        updateData.location = {
          coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)],
        };
      }

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
