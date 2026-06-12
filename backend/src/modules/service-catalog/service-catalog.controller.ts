import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import serviceCatalogService from './service-catalog.service';
import { serviceRepository } from './service-catalog.repository';
import { createServiceSchema, updateServiceSchema } from './service-catalog.validator';
import { validateSchema } from '../../shared/utils/validation.util';
import { AppError, BadRequestError } from '../../shared/utils/apiError.util';

class ServiceCatalogController {
  // GET /api/service-categories
  async getCategories(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await serviceCatalogService.getCategories();
      res.status(200).json({
        status: 'success',
        message: 'Service categories retrieved successfully',
        data: categories,
      });
    } catch (err) {
      next(err);
    }
  }

  // GET /api/company/services
  async getServices(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;
      const services = await serviceRepository.findByCompanyId(companyId);
      res.json({ status: 'success', data: services });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }

  // GET /api/company/services/:serviceId
  async getServiceById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;
      const { serviceId } = req.params;
      const service = await serviceCatalogService.getServiceById(serviceId, companyId);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }

  // POST /api/company/services/new
  async createService(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;
      const serviceData = { ...req.body, company_id: companyId };

      const value = validateSchema<any>(createServiceSchema, serviceData, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
      });

      const service = await serviceCatalogService.createService(value);
      res.status(201).json({ status: 'success', data: service });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }

  // PUT /api/company/services/:serviceId
  async updateService(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;
      const { serviceId } = req.params;

      const value = validateSchema<any>(updateServiceSchema, req.body, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
      });

      const service = await serviceCatalogService.updateService(serviceId, companyId, value);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }

  // DELETE /api/company/services/:serviceId/delete
  async deleteService(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;
      const { serviceId } = req.params;
      const service = await serviceCatalogService.deleteService(serviceId, companyId);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }
}

export default new ServiceCatalogController();
