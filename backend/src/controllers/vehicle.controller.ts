import { Request, Response } from 'express';
import { vehicleService } from '../services/vehicle.service';

export class VehicleController {
  async getVehicles(req: Request, res: Response) {
    try {
      // Mock company ID cho đến khi có Auth middleware hoàn chỉnh
      const companyId = (req.headers['x-company-id'] as string) || '6605b0b2b892a0f8b4a00001';

      const vehicles = await vehicleService.getVehicles(companyId);
      res.json({ status: 'success', data: vehicles });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getVehicle(req: Request, res: Response) {
    try {
      const vehicle = await vehicleService.getVehicleById(req.params.id);
      res.json({ status: 'success', data: vehicle });
    } catch (error: any) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }

  async createVehicle(req: Request, res: Response) {
    try {
      const companyId = (req.headers['x-company-id'] as string) || '6605b0b2b892a0f8b4a00001';
      const data = req.body;
      const vehicle = await vehicleService.createVehicle(companyId, data);
      res.status(201).json({ status: 'success', data: vehicle });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async updateVehicle(req: Request, res: Response) {
    try {
      const companyId = (req.headers['x-company-id'] as string) || '6605b0b2b892a0f8b4a00001';
      const data = req.body;
      const vehicle = await vehicleService.updateVehicle(companyId, req.params.id, data);
      res.json({ status: 'success', data: vehicle });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async deleteVehicle(req: Request, res: Response) {
    try {
      const companyId = (req.headers['x-company-id'] as string) || '6605b0b2b892a0f8b4a00001';
      await vehicleService.deleteVehicle(companyId, req.params.id);
      res.json({ status: 'success', message: 'Vehicle deleted successfully' });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export const vehicleController = new VehicleController();
