import { http } from './http';
import { ApiResponse } from '../types/common.type';
import { LoginData, CustomerRegisterData } from '../types/auth.type';

export const authService = {
  login: async (email: string, password: string): Promise<ApiResponse<LoginData>> => {
    const response = await http.post<ApiResponse<LoginData>>(`/auth/login`, {
      email,
      password,
    });
    return response.data;
  },
  registerCustomer: async (data: {
    email: string;
    password: string;
    full_name: string;
    phone: string;
  }): Promise<ApiResponse<CustomerRegisterData>> => {
    const response = await http.post<ApiResponse<CustomerRegisterData>>(`/auth/customer-register`, data);
    return response.data;
  },
  registerCompany: async (data: {
    email: string;
    password: string;
    company_name: string;
    director_name: string;
    phone: string;
    address: string;
    latitude: number;
    longitude: number;
    service_area: string;
    license_file?: File | null;
    terms_accepted: boolean;
  }): Promise<ApiResponse<any>> => {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('company_name', data.company_name);
    formData.append('director_name', data.director_name);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('latitude', String(data.latitude));
    formData.append('longitude', String(data.longitude));
    formData.append('service_area', data.service_area);
    formData.append('terms_accepted', String(data.terms_accepted));
    if (data.license_file) {
      formData.append('license_file', data.license_file);
    }

    const response = await http.post<ApiResponse<any>>(`/auth/company-register`, formData);
    return response.data;
  },
};
