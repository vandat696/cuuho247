import { Response } from 'express';
import { vehicleService } from '../services/vehicle.service';
import { AuthRequest } from '../middleware/auth.middleware';

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
      const data = req.body;
      const vehicle = await vehicleService.createVehicle(companyId, data);
      res.status(201).json({ status: 'success', data: vehicle });
    } catch (error: unknown) {
      const err = error as Error;
      res.status(400).json({ status: 'error', message: err.message });
    }
  }

  async updateVehicle(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const data = req.body;
      const vehicle = await vehicleService.updateVehicle(companyId, req.params.id, data);
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
