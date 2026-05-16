import { http } from './http';
import { ApiResponse, Company } from '../types/common.type';

export const companyService = {
  /**
   * Get current company profile (uses stored company ID from login)
   */
  getProfile: async (): Promise<ApiResponse<Company>> => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      throw new Error('Company ID not found');
    }
    const response = await http.get<ApiResponse<Company>>(`/company/${companyId}`);
    return response.data;
  },

  /**
   * Update company profile
   */
  updateProfile: async (data: Partial<Company>): Promise<ApiResponse<Company>> => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      throw new Error('Company ID not found');
    }
    const response = await http.patch<ApiResponse<Company>>(`/company/${companyId}`, data);
    return response.data;
  },
};
