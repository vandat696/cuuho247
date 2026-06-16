export interface CreateVehicleInput {
  plate_number: string;
  vehicle_type: string;
  status?: 'available' | 'unavailable';
}
