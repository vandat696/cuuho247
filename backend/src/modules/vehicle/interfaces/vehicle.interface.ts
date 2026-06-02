/**
 * Vehicle Module – Public Contracts (Interfaces)
 */
import type { IVehicle } from '@/shared/models/Vehicle.model';

// ─── Input DTOs ────────────────────────────────────────────────────────────────

export interface CreateVehicleInput {
  plate_number: string;
  vehicle_type: string;
  status?: 'available' | 'unavailable';
}

// ─── Repository Contract ───────────────────────────────────────────────────────

export interface IVehicleRepository {
  findByCompany(companyId: string): Promise<IVehicle[]>;
  findById(vehicleId: string): Promise<IVehicle | null>;
  findByPlateNumber(plateNumber: string): Promise<IVehicle | null>;
  create(data: Partial<IVehicle>): Promise<IVehicle>;
  update(vehicleId: string, data: Partial<IVehicle>): Promise<IVehicle | null>;
  delete(vehicleId: string): Promise<IVehicle | null>;
}

// ─── Service Contract ──────────────────────────────────────────────────────────

export interface IVehicleService {
  getVehicles(companyId: string): Promise<IVehicle[]>;
  getVehicleById(companyId: string, vehicleId: string): Promise<IVehicle>;
  createVehicle(companyId: string, data: CreateVehicleInput): Promise<IVehicle>;
  updateVehicle(companyId: string, vehicleId: string, data: Partial<IVehicle>): Promise<IVehicle | null>;
  deleteVehicle(companyId: string, vehicleId: string): Promise<IVehicle | null>;
}
