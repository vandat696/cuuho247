import { http } from './http';
import { Service, ServiceFormData, ServiceCategory } from '../types/service.types';

interface ServiceApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export const serviceService = {
  getCompanyId: (): string => {
    const companyId = localStorage.getItem('companyId');
    if (!companyId) {
      throw new Error('Company ID not found');
    }
    return companyId;
  },

  /**
   * Get all services for the authenticated company
   */
  getServices: async (): Promise<ServiceApiResponse<Service[]>> => {
    const response = await http.get<ServiceApiResponse<Service[]>>(`/company/services`);
    return response.data;
  },

  /**
   * Get service by ID
   */
  getServiceById: async (serviceId: string): Promise<ServiceApiResponse<Service>> => {
    const response = await http.get<ServiceApiResponse<Service>>(`/company/services/${serviceId}`);
    return response.data;
  },

  /**
   * Create a new service
   */
  createService: async (data: ServiceFormData): Promise<ServiceApiResponse<Service>> => {
    const response = await http.post<ServiceApiResponse<Service>>(`/company/services/new`, data);
    return response.data;
  },

  /**
   * Update existing service
   */
  updateService: async (serviceId: string, data: Partial<ServiceFormData>): Promise<ServiceApiResponse<Service>> => {
    const response = await http.put<ServiceApiResponse<Service>>(`/company/services/${serviceId}`, data);
    return response.data;
  },

  /**
   * Delete service
   */
  deleteService: async (serviceId: string): Promise<ServiceApiResponse<Service>> => {
    const response = await http.delete<ServiceApiResponse<Service>>(`/company/services/${serviceId}/delete`);
    return response.data;
  },

  /**
   * Get service categories
   */
  getCategories: async (): Promise<ServiceApiResponse<ServiceCategory[]>> => {
    const response = await http.get<ServiceApiResponse<ServiceCategory[]>>('/service-categories');
    return response.data;
  },
};
