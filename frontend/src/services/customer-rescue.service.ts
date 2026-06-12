import { ApiResponse } from '@/types/common.type';
import { SearchCompaniesParams, SearchCompaniesResult } from '@/types/rescue.type';
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

export const customerRescueService = {
  searchCompanies: async (params: SearchCompaniesParams): Promise<ApiResponse<SearchCompaniesResult>> => {
    const { lat, lng, incident_type, max_distance_km } = params;

    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
    });

    if (incident_type) queryParams.append('incident_type', incident_type);
    if (max_distance_km) queryParams.append('max_distance_km', max_distance_km.toString());

    const response = await axiosInstance.get<ApiResponse<SearchCompaniesResult>>(
      `/rescue/companies?${queryParams.toString()}`,
      { skipGlobalErrorToast: true }
    );
    return response.data;
  },

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
