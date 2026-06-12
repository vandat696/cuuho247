import { Response, NextFunction } from 'express';
import { vehicleService } from './vehicle.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { createVehicleSchema, updateVehicleSchema } from './vehicle.validator';
import { validateSchema } from '../../shared/utils/validation.util';
import { AppError, BadRequestError, NotFoundError } from '../../shared/utils/apiError.util';

export class VehicleController {
  async getVehicles(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;

      const vehicles = await vehicleService.getVehicles(companyId);
      res.json({ status: 'success', data: vehicles });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }

  async getVehicle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;
      const vehicle = await vehicleService.getVehicleById(companyId, req.params.id);
      res.json({ status: 'success', data: vehicle });
    } catch (error: any) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new NotFoundError(error.message));
      }
    }
  }

  async createVehicle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;

      const value = validateSchema<any>(createVehicleSchema, req.body, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
      });

      const vehicle = await vehicleService.createVehicle(companyId, value);
      res.status(201).json({ status: 'success', data: vehicle });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }

  async updateVehicle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;

      const value = validateSchema<any>(updateVehicleSchema, req.body, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
      });

      const vehicle = await vehicleService.updateVehicle(companyId, req.params.id, value);
      res.json({ status: 'success', data: vehicle });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }

  async deleteVehicle(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;
      await vehicleService.deleteVehicle(companyId, req.params.id);
      res.json({ status: 'success', message: 'Vehicle deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError((error as Error).message));
      }
    }
  }
}

export const vehicleController = new VehicleController();
