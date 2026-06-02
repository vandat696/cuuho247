import { Response } from 'express';
import { ValidationErrorItem } from 'joi';
import { vehicleService } from './vehicle.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { createVehicleSchema, updateVehicleSchema } from './vehicle.validator';

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

      const { error, value } = createVehicleSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMessages = error.details.map((detail: ValidationErrorItem) => detail.message);
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: errorMessages,
        });
        return;
      }

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

      const { error, value } = updateVehicleSchema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMessages = error.details.map((detail: ValidationErrorItem) => detail.message);
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: errorMessages,
        });
        return;
      }

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
