import { Request, Response, NextFunction } from 'express';
import { ServiceCategory } from '../models/ServiceCategory.model';

class ServiceCategoryController {
  async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await ServiceCategory.find({ is_active: { $ne: false } })
        .sort({ created_at: 1 })
        .lean();

      res.status(200).json({
        status: 'success',
        message: 'Service categories retrieved successfully',
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new ServiceCategoryController();
