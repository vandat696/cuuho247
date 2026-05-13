import { Response } from 'express';
import { AuthRequest } from '@/middleware/auth.middleware';
import serviceService from '@/services/service.service';
import serviceRepository from '@/repositories/service.repository';

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
      const service = await serviceService.getServiceById(serviceId, companyId);
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
      const service = await serviceService.createService(serviceData);
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
      const updateData = req.body;
      const service = await serviceService.updateService(serviceId, companyId, updateData);
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
      const service = await serviceService.deleteService(serviceId, companyId);
      res.json({ status: 'success', data: service });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }
}

export default new ServiceController();
