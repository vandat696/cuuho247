import { http } from './http';
import { ApiResponse } from '../types/common.type';
import {
  ActiveRescueRequestDetailResult,
  ActiveRescueRequestsResult,
  CompletedRescueRequestsResult,
  PendingRescueRequestDetailResult,
  PendingRescueRequestsResult,
  SearchCompaniesParams,
  SearchCompaniesResult,
} from '../types/rescue.type';

export const rescueService = {
  searchCompanies: async (params: SearchCompaniesParams): Promise<ApiResponse<SearchCompaniesResult>> => {
    const { lat, lng, incident_type, max_distance_km } = params;

    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
    });

    if (incident_type) queryParams.append('incident_type', incident_type);
    if (max_distance_km) queryParams.append('max_distance_km', max_distance_km.toString());

    const response = await http.get<ApiResponse<SearchCompaniesResult>>(`/rescue/companies?${queryParams.toString()}`);
    return response.data;
  },

  getCompanyPendingRequests: async (): Promise<ApiResponse<PendingRescueRequestsResult>> => {
    const response = await http.get<ApiResponse<PendingRescueRequestsResult>>('/rescue/company/pending');
    return response.data;
  },

  getCompanyActiveRequests: async (): Promise<ApiResponse<ActiveRescueRequestsResult>> => {
    const response = await http.get<ApiResponse<ActiveRescueRequestsResult>>('/rescue/company/active');
    return response.data;
  },

  getCompanyActiveRequestDetail: async (requestId: string): Promise<ApiResponse<ActiveRescueRequestDetailResult>> => {
    const response = await http.get<ApiResponse<ActiveRescueRequestDetailResult>>(
      `/rescue/company/active/${requestId}`
    );
    return response.data;
  },

  getCompanyCompletedRequests: async (): Promise<ApiResponse<CompletedRescueRequestsResult>> => {
    const response = await http.get<ApiResponse<CompletedRescueRequestsResult>>('/rescue/company/completed');
    return response.data;
  },

  getCompanyPendingRequestDetail: async (requestId: string): Promise<ApiResponse<PendingRescueRequestDetailResult>> => {
    const response = await http.get<ApiResponse<PendingRescueRequestDetailResult>>(
      `/rescue/company/pending/${requestId}`
    );
    return response.data;
  },
};
