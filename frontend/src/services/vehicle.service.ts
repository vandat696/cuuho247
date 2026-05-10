import { IVehicle, CreateVehicleDto, UpdateVehicleDto } from '../types/vehicle.types';

// Local mock data for UI testing when there is no logged-in company context.
const MOCK_COMPANY_ID = '1';

let mockVehicles: IVehicle[] = [
  {
    _id: 'mock-vehicle-1',
    company_id: MOCK_COMPANY_ID,
    plate_number: '30A-12345',
    vehicle_type: 'Xe kéo ô tô',
    status: 'available',
  },
  {
    _id: 'mock-vehicle-2',
    company_id: MOCK_COMPANY_ID,
    plate_number: '29B-67890',
    vehicle_type: 'Xe tải cẩu',
    status: 'unavailable',
  },
  {
    _id: 'mock-vehicle-3',
    company_id: MOCK_COMPANY_ID,
    plate_number: '34C-11223',
    vehicle_type: 'Xe máy cứu hộ',
    status: 'available',
  },
];

const createMockVehicle = (data: CreateVehicleDto): IVehicle => ({
  _id: `mock-vehicle-${Date.now()}`,
  company_id: MOCK_COMPANY_ID,
  plate_number: data.plate_number,
  vehicle_type: data.vehicle_type,
  status: data.status ?? 'available',
});

export const vehicleService = {
  getVehicles: async (): Promise<IVehicle[]> => {
    // Real API mode:
    // const response = await http.get('/vehicles');
    // return response.data.data;

    return mockVehicles.map((vehicle) => ({ ...vehicle }));
  },

  getVehicle: async (id: string): Promise<IVehicle> => {
    // Real API mode:
    // const response = await http.get(`/vehicles/${id}`);
    // return response.data.data;

    const vehicle = mockVehicles.find((item) => item._id === id) ?? mockVehicles[0];
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return { ...vehicle };
  },

  createVehicle: async (data: CreateVehicleDto): Promise<IVehicle> => {
    // Real API mode:
    // const response = await http.post('/vehicles', data);
    // return response.data.data;

    const vehicle = createMockVehicle(data);
    mockVehicles = [vehicle, ...mockVehicles];
    return { ...vehicle };
  },

  updateVehicle: async (id: string, data: UpdateVehicleDto): Promise<IVehicle> => {
    // Real API mode:
    // const response = await http.patch(`/vehicles/${id}`, data);
    // return response.data.data;

    const index = mockVehicles.findIndex((vehicle) => vehicle._id === id);
    if (index === -1) {
      throw new Error('Vehicle not found');
    }

    const updatedVehicle: IVehicle = {
      ...mockVehicles[index],
      ...data,
    };

    mockVehicles[index] = updatedVehicle;
    return { ...updatedVehicle };
  },

  deleteVehicle: async (id: string): Promise<void> => {
    // Real API mode:
    // await http.delete(`/vehicles/${id}`);

    mockVehicles = mockVehicles.filter((vehicle) => vehicle._id !== id);
  },
};
