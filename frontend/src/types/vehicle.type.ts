export type VehicleStatus = 'available' | 'unavailable';

export interface IVehicle {
  _id: string;
  company_id: string;
  plate_number: string;
  vehicle_type: string;
  status: VehicleStatus;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVehicleDto {
  plate_number: string;
  vehicle_type: string;
  status?: VehicleStatus;
}

export interface UpdateVehicleDto {
  plate_number?: string;
  vehicle_type?: string;
  status?: VehicleStatus;
}
