import { ApiResponse, Company, User } from '@/types/common.type';
import { http as axiosInstance } from './http';

export interface AuditLog {
  _id: string;
  admin_id: {
    _id: string;
    full_name: string;
    email: string;
  };
  action: string;
  target_type: string;
  target_id: string;
  target_name?: string;
  reason?: string;
  details?: {
    reason?: string;
    [key: string]: any;
  };
  created_at: string;
}

export interface GetAuditLogsResult {
  logs: AuditLog[];
  total: number;
}

export const adminService = {
  getPendingCompanies: async (): Promise<ApiResponse<Company[]>> => {
    const response = await axiosInstance.get<ApiResponse<Company[]>>('/admin/companies/pending');
    return response.data;
  },

  approveCompany: async (companyId: string, reason?: string): Promise<ApiResponse<Company>> => {
    const response = await axiosInstance.patch<ApiResponse<Company>>(`/admin/companies/${companyId}/approve`, {
      reason,
    });
    return response.data;
  },

  rejectCompany: async (companyId: string, reason: string): Promise<ApiResponse<Company>> => {
    const response = await axiosInstance.patch<ApiResponse<Company>>(`/admin/companies/${companyId}/reject`, {
      reason,
    });
    return response.data;
  },

  requestDocuments: async (companyId: string, reason: string): Promise<ApiResponse<Company>> => {
    const response = await axiosInstance.patch<ApiResponse<Company>>(`/admin/companies/${companyId}/request-docs`, {
      reason,
    });
    return response.data;
  },

  getAuditLogs: async (limit: number = 50, skip: number = 0): Promise<ApiResponse<GetAuditLogsResult>> => {
    const response = await axiosInstance.get<ApiResponse<GetAuditLogsResult>>('/admin/logs', {
      params: { limit, skip },
    });
    return response.data;
  },

  getReviews: async (limit: number = 20, page: number = 1): Promise<ApiResponse<{ reviews: any[]; total: number }>> => {
    const response = await axiosInstance.get<ApiResponse<{ reviews: any[]; total: number }>>('/admin/reviews', {
      params: { limit, page },
    });
    return response.data;
  },

  removeReview: async (reviewId: string, reason: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/admin/reviews/${reviewId}/remove`, { reason });
    return response.data;
  },

  removeReviewReply: async (reviewId: string, reason: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/admin/reviews/${reviewId}/reply/remove`, { reason });
    return response.data;
  },

  restoreReview: async (reviewId: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/admin/reviews/${reviewId}/restore`);
    return response.data;
  },

  restoreReviewReply: async (reviewId: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/admin/reviews/${reviewId}/reply/restore`);
    return response.data;
  },

  getUsers: async (
    search?: string,
    status?: string,
    limit: number = 20,
    page: number = 1
  ): Promise<ApiResponse<{ users: User[]; total: number }>> => {
    const response = await axiosInstance.get<ApiResponse<{ users: User[]; total: number }>>('/admin/users', {
      params: { search, status, limit, page },
    });
    return response.data;
  },

  getUserDetail: async (userId: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.get<ApiResponse<User>>(`/admin/users/${userId}`);
    return response.data;
  },

  lockUser: async (userId: string, reason: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(`/admin/users/${userId}/lock`, { reason });
    return response.data;
  },

  unlockUser: async (userId: string, reason: string): Promise<ApiResponse<User>> => {
    const response = await axiosInstance.patch<ApiResponse<User>>(`/admin/users/${userId}/unlock`, { reason });
    return response.data;
  },

  getUserLogs: async (userId: string): Promise<ApiResponse<AuditLog[]>> => {
    const response = await axiosInstance.get<ApiResponse<AuditLog[]>>(`/admin/users/${userId}/logs`);
    return response.data;
  },

  getCompanies: async (
    search?: string,
    status?: string,
    limit: number = 20,
    page: number = 1
  ): Promise<ApiResponse<{ companies: Company[]; total: number }>> => {
    const response = await axiosInstance.get<ApiResponse<{ companies: Company[]; total: number }>>('/admin/companies', {
      params: { search, status, limit, page },
    });
    return response.data;
  },

  getCompanyDetail: async (companyId: string): Promise<ApiResponse<Company>> => {
    const response = await axiosInstance.get<ApiResponse<Company>>(`/admin/companies/${companyId}`);
    return response.data;
  },

  lockCompany: async (companyId: string, reason: string): Promise<ApiResponse<Company>> => {
    const response = await axiosInstance.patch<ApiResponse<Company>>(`/admin/companies/${companyId}/lock`, { reason });
    return response.data;
  },

  unlockCompany: async (companyId: string, reason: string): Promise<ApiResponse<Company>> => {
    const response = await axiosInstance.patch<ApiResponse<Company>>(`/admin/companies/${companyId}/unlock`, {
      reason,
    });
    return response.data;
  },

  getCompanyLogs: async (companyId: string): Promise<ApiResponse<AuditLog[]>> => {
    const response = await axiosInstance.get<ApiResponse<AuditLog[]>>(`/admin/companies/${companyId}/logs`);
    return response.data;
  },
};
