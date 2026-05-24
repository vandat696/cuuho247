import { http as axiosInstance } from './http';

export interface CreateRequestPayload {
  company_id: string;
  description: string;
  location: { lat: number; lng: number };
  address?: string;
  service_types?: string[];
  incident_photos?: string[];
}

export const rescueRequestService = {
  createRequest: async (payload: CreateRequestPayload) => {
    const response = await axiosInstance.post('/rescue-requests', payload);
    return response.data;
  },

  cancelRequest: async (requestId: string) => {
    const response = await axiosInstance.patch(`/rescue-requests/${requestId}/cancel`);
    return response.data;
  },

  // Lấy danh sách yêu cầu cứu hộ của user (có thể dùng chung endpoint GET /rescue-requests nếu có)
  getMyRequests: async () => {
    const response = await axiosInstance.get('/rescue-requests/my-requests');
    return response.data;
  },
};
