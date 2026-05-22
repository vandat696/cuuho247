import { http } from './http';
import { ApiResponse } from '../types/common.type';
import { PendingRescueRequestsResult, SearchCompaniesParams, SearchCompaniesResult } from '../types/rescue.type';

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
};
