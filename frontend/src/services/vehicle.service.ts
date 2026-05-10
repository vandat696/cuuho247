import axios from 'axios';
import { IVehicle, CreateVehicleDto, UpdateVehicleDto } from '../types/vehicle.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance mock x-company-id
const api = axios.create({
  baseURL: `${API_URL}/vehicles`,
  headers: {
    'x-company-id': '6605b0b2b892a0f8b4a00001', // Mock company ID
  },
});

export const vehicleService = {
  getVehicles: async (): Promise<IVehicle[]> => {
    const response = await api.get('/');
    return response.data.data;
  },

  getVehicle: async (id: string): Promise<IVehicle> => {
    const response = await api.get(`/${id}`);
    return response.data.data;
  },

  createVehicle: async (data: CreateVehicleDto): Promise<IVehicle> => {
    const response = await api.post('/', data);
    return response.data.data;
  },

  updateVehicle: async (id: string, data: UpdateVehicleDto): Promise<IVehicle> => {
    const response = await api.patch(`/${id}`, data);
    return response.data.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await api.delete(`/${id}`);
  },
};
