import { Vehicle, IVehicle } from '@/shared/models/Vehicle.model';

class VehicleRepository {
  async findByCompany(companyId: string): Promise<IVehicle[]> {
    return Vehicle.find({ company_id: companyId }).sort({ created_at: -1 });
  }

  async findById(vehicleId: string): Promise<IVehicle | null> {
    return Vehicle.findById(vehicleId);
  }

  async findByPlateNumber(plateNumber: string): Promise<IVehicle | null> {
    return Vehicle.findOne({ plate_number: plateNumber });
  }

  async create(data: Partial<IVehicle>): Promise<IVehicle> {
    const vehicle = new Vehicle(data);
    return vehicle.save();
  }

  async update(vehicleId: string, data: Partial<IVehicle>): Promise<IVehicle | null> {
    return Vehicle.findByIdAndUpdate(vehicleId, data, { new: true, runValidators: true });
  }

  async delete(vehicleId: string): Promise<IVehicle | null> {
    return Vehicle.findByIdAndDelete(vehicleId);
  }
}

export const vehicleRepository = new VehicleRepository();
