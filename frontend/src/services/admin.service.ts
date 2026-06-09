import { ApiResponse, Company } from '@/types/common.type';
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
};
