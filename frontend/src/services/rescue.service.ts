import axios from 'axios';
import { ApiResponse } from '../types/common.type';
import { SearchCompaniesParams, SearchCompaniesResult } from '../types/rescue.type';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const rescueService = {
  searchCompanies: async (params: SearchCompaniesParams): Promise<ApiResponse<SearchCompaniesResult>> => {
    const { lat, lng, incident_type, max_distance_km } = params;

    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
    });

    if (incident_type) queryParams.append('incident_type', incident_type);
    if (max_distance_km) queryParams.append('max_distance_km', max_distance_km.toString());

    const response = await axios.get<ApiResponse<SearchCompaniesResult>>(
      `${API_URL}${API_URL.endsWith('/api') ? '' : '/api'}/rescue/companies?${queryParams.toString()}`
    );
    return response.data;
  },
};
