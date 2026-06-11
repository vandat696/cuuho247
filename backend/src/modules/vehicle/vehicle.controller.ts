import { Response } from 'express';
import { vehicleService } from './vehicle.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { createVehicleSchema, updateVehicleSchema } from './vehicle.validator';
import { validateSchema } from '../../shared/utils/validation.util';

export class VehicleController {
  async getVehicles(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;

      const vehicles = await vehicleService.getVehicles(companyId);
      res.json({ status: 'success', data: vehicles });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async getVehicle(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const vehicle = await vehicleService.getVehicleById(companyId, req.params.id);
      res.json({ status: 'success', data: vehicle });
    } catch (error: any) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async createVehicle(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;

      const value = validateSchema<any>(createVehicleSchema, req.body, res, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
      });
      if (!value) return;

      const vehicle = await vehicleService.createVehicle(companyId, value);
      res.status(201).json({ status: 'success', data: vehicle });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async updateVehicle(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;

      const value = validateSchema<any>(updateVehicleSchema, req.body, res, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
      });
      if (!value) return;

      const vehicle = await vehicleService.updateVehicle(companyId, req.params.id, value);
      res.json({ status: 'success', data: vehicle });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async deleteVehicle(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      await vehicleService.deleteVehicle(companyId, req.params.id);
      res.json({ status: 'success', message: 'Vehicle deleted successfully' });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }
}

export const vehicleController = new VehicleController();
