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
}

export default new CompanyController();
