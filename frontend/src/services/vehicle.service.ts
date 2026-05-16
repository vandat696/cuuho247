import { http } from './http';
import { ApiResponse } from '../types/common.type';
import { IVehicle, CreateVehicleDto, UpdateVehicleDto } from '../types/vehicle.types';

export const vehicleService = {
  getVehicles: async (): Promise<IVehicle[]> => {
    const response = await http.get<ApiResponse<IVehicle[]>>('/vehicles');
    return response.data.data;
  },

  getVehicle: async (id: string): Promise<IVehicle> => {
    const response = await http.get<ApiResponse<IVehicle>>(`/vehicles/${id}`);
    return response.data.data;
  },

  createVehicle: async (data: CreateVehicleDto): Promise<IVehicle> => {
    const response = await http.post<ApiResponse<IVehicle>>('/vehicles', data);
    return response.data.data;
  },

  updateVehicle: async (id: string, data: UpdateVehicleDto): Promise<IVehicle> => {
    const response = await http.patch<ApiResponse<IVehicle>>(`/vehicles/${id}`, data);
    return response.data.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await http.delete(`/vehicles/${id}`);
  },
};
