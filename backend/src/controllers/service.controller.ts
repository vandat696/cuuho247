import { Response } from 'express';
import { ValidationErrorItem } from 'joi';
import { AuthRequest } from '@/middleware/auth.middleware';
import companyServiceService from '@/services/companyService.service';
import serviceRepository from '@/repositories/service.repository';
import { createServiceSchema, updateServiceSchema } from '@/validators/service.validator';

class ServiceController {
  // get all
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
  // get service by id
  async getServiceById(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const { serviceId } = req.params;
      const service = await companyServiceService.getServiceById(serviceId, companyId);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }
  // create service
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

      const service = await companyServiceService.createService(value);
      res.status(201).json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }
  // update service
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

      const service = await companyServiceService.updateService(serviceId, companyId, value);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }
  // delete service
  async deleteService(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const { serviceId } = req.params;
      const service = await companyServiceService.deleteService(serviceId, companyId);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }
}

export default new ServiceController();
