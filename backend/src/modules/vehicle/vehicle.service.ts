import { RescueRequest } from '@/shared/models/RescueRequest.model';
import { IVehicle } from '@/shared/models/Vehicle.model';
import { vehicleRepository } from './vehicle.repository';
import type { IVehicleService, CreateVehicleInput } from './interfaces/vehicle.interface';

export class VehicleService implements IVehicleService {
  async getVehicles(companyId: string): Promise<IVehicle[]> {
    return vehicleRepository.findByCompany(companyId);
  }

  async getVehicleById(companyId: string, vehicleId: string): Promise<IVehicle> {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    if (vehicle.company_id.toString() !== companyId) {
      throw new Error('Unauthorized to access this vehicle');
    }
    return vehicle;
  }

  async createVehicle(companyId: string, data: CreateVehicleInput): Promise<IVehicle> {
    // Check if plate number already exists
    const existing = await vehicleRepository.findByPlateNumber(data.plate_number);
    if (existing) {
      throw new Error('Plate number already exists');
    }

    return vehicleRepository.create({
      company_id: companyId as any,
      plate_number: data.plate_number,
      vehicle_type: data.vehicle_type,
      status: data.status || 'available',
    });
  }

  async updateVehicle(companyId: string, vehicleId: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    // Ensure the vehicle belongs to the company
    if (vehicle.company_id.toString() !== companyId) {
      throw new Error('Unauthorized to update this vehicle');
    }

    // Check plate number conflict if updating plate_number
    if (data.plate_number && data.plate_number !== vehicle.plate_number) {
      const existing = await vehicleRepository.findByPlateNumber(data.plate_number);
      if (existing) {
        throw new Error('Plate number already exists');
      }
    }

    return vehicleRepository.update(vehicleId, data);
  }

  async deleteVehicle(companyId: string, vehicleId: string): Promise<IVehicle | null> {
    const vehicle = await vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.company_id.toString() !== companyId) {
      throw new Error('Unauthorized to delete this vehicle');
    }

    const activeMission = await RescueRequest.findOne({
      'vehicle.vehicle_id': vehicleId,
      status: { $in: ['pending', 'accepted', 'in_progress'] },
    });

    if (activeMission) {
      throw new Error('Không thể xóa xe đang trong quá trình cứu hộ');
    }

    return vehicleRepository.delete(vehicleId);
  }
}

export const vehicleService = new VehicleService();
