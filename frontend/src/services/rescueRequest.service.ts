import { ApiResponse } from '@/types/common.type';
import { http as axiosInstance } from './http';

export interface CreateRequestPayload {
  company_id: string;
  description: string;
  location: { lat: number; lng: number };
  address?: string;
  service_types?: string[];
  incident_photos?: string[];
}

export type CustomerRescueRequestStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'arrived'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'timeout';

export interface CustomerRescueRequest {
  _id: string;
  description: string;
  company: {
    company_id: string;
    company_name?: string;
  };
  vehicle?: {
    vehicle_id: string;
    plate_number?: string;
  };
  location?: {
    coordinates: [number, number]; // [lng, lat]
  };
  status?: CustomerRescueRequestStatus;
  eta_minutes?: number;
  created_at?: string;
  updated_at?: string;
  accepted_at?: string;
  started_at?: string;
  arrived_at?: string;
  completed_at?: string;
  cancelled_at?: string;
  cancellation?: {
    cancelled_by?: 'user' | 'company' | 'system';
    reason?: string;
  };
}

export interface MyRescueRequestsResult {
  total: number;
  requests: CustomerRescueRequest[];
}

export const rescueRequestService = {
  createRequest: async (payload: CreateRequestPayload) => {
    const response = await axiosInstance.post('/rescue/requests', payload);
    return response.data;
  },

  cancelRequest: async (requestId: string, reason: string): Promise<ApiResponse<CustomerRescueRequest>> => {
    const response = await axiosInstance.patch<ApiResponse<CustomerRescueRequest>>(
      `/rescue/requests/${requestId}/cancel`,
      { reason }
    );
    return response.data;
  },

  getMyRequests: async (): Promise<ApiResponse<MyRescueRequestsResult>> => {
    const response = await axiosInstance.get<ApiResponse<MyRescueRequestsResult>>('/rescue/requests/my-requests');
    return response.data;
  },
};
