import { Request, Response, NextFunction } from 'express';
import { ValidationErrorItem } from 'joi';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import serviceCatalogService from './service-catalog.service';
import { serviceRepository } from './service-catalog.repository';
import { createServiceSchema, updateServiceSchema } from './service-catalog.validator';

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
  async getServices(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const services = await serviceRepository.findByCompanyId(companyId);
      res.json({ status: 'success', data: services });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  // GET /api/company/services/:serviceId
  async getServiceById(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const { serviceId } = req.params;
      const service = await serviceCatalogService.getServiceById(serviceId, companyId);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  // POST /api/company/services/new
  async createService(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const serviceData = { ...req.body, company_id: companyId };

      const { error, value } = createServiceSchema.validate(serviceData, { abortEarly: false });
      if (error) {
        const errorMessages = error.details.map((detail: ValidationErrorItem) => detail.message);
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: errorMessages,
        });
        return;
      }

      const service = await serviceCatalogService.createService(value);
      res.status(201).json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  // PUT /api/company/services/:serviceId
  async updateService(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const { serviceId } = req.params;

      const { error, value } = updateServiceSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMessages = error.details.map((detail: ValidationErrorItem) => detail.message);
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: errorMessages,
        });
        return;
      }

      const service = await serviceCatalogService.updateService(serviceId, companyId, value);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  // DELETE /api/company/services/:serviceId/delete
  async deleteService(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const { serviceId } = req.params;
      const service = await serviceCatalogService.deleteService(serviceId, companyId);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }
}

export default new ServiceCatalogController();
