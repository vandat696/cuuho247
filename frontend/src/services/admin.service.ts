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

export interface ServiceTypeStat {
  categoryId: string;
  name: string;
  count: number;
  percentage: number;
}

export interface StatusStat {
  status: string;
  count: number;
}

export interface TimeSeriesPoint {
  date: string;
  count: number;
  completed: number;
  cancelled: number;
}

export interface RescueActivitiesReport {
  summary: {
    totalRequests: number;
    completedRequests: number;
    cancelledRequests: number;
    successRate: number;
    totalRevenue: number;
  };
  serviceTypeStats: ServiceTypeStat[];
  statusStats: StatusStat[];
  timeSeries: TimeSeriesPoint[];
}

export interface DetailedRatingsAvg {
  response_time: number;
  service_quality: number;
  staff_attitude: number;
  pricing: number;
}

export interface CompanyQualityBreakdown {
  companyId: string;
  companyName: string;
  totalRequests: number;
  responseRate: number;
  avgResponseTime: number;
  avgRating: number;
  reviewCount: number;
}

export interface QualityTimeSeriesPoint {
  date: string;
  totalRequests: number;
  responseRate: number;
  avgRating: number;
  reviewCount: number;
}

export interface ServiceQualityReport {
  summary: {
    totalRequests: number;
    respondedRequests: number;
    responseRate: number;
    avgResponseTime: number;
    totalReviews: number;
    avgRating: number;
    detailedRatingsAvg?: DetailedRatingsAvg;
  };
  companyBreakdown?: CompanyQualityBreakdown[];
  timeSeries: QualityTimeSeriesPoint[];
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

  getCommunityPosts: async (
    search?: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<{ posts: any[]; total: number }>> => {
    const response = await axiosInstance.get<ApiResponse<{ posts: any[]; total: number }>>('/admin/community/posts', {
      params: { search, page, limit },
    });
    return response.data;
  },

  getPostComments: async (postId: string): Promise<ApiResponse<any[]>> => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(`/admin/community/posts/${postId}/comments`);
    return response.data;
  },

  removePost: async (postId: string, reason: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/admin/community/posts/${postId}/remove`, { reason });
    return response.data;
  },

  restorePost: async (postId: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/admin/community/posts/${postId}/restore`);
    return response.data;
  },

  removeComment: async (commentId: string, reason: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/admin/community/comments/${commentId}/remove`, {
      reason,
    });
    return response.data;
  },

  restoreComment: async (commentId: string): Promise<ApiResponse<any>> => {
    const response = await axiosInstance.put<ApiResponse<any>>(`/admin/community/comments/${commentId}/restore`);
    return response.data;
  },

  getRescueActivitiesReport: async (params: {
    startDate?: string;
    endDate?: string;
    serviceCategoryId?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<RescueActivitiesReport>> => {
    const response = await axiosInstance.get<ApiResponse<RescueActivitiesReport>>('/admin/reports/rescue-activities', {
      params,
    });
    return response.data;
  },

  getAllCompaniesForFilter: async (): Promise<ApiResponse<{ _id: string; company_name: string }[]>> => {
    const response =
      await axiosInstance.get<ApiResponse<{ _id: string; company_name: string }[]>>('/admin/companies/all');
    return response.data;
  },

  getServiceQualityReport: async (params: {
    startDate?: string;
    endDate?: string;
    companyId?: string;
    groupBy?: 'day' | 'week' | 'month';
  }): Promise<ApiResponse<ServiceQualityReport>> => {
    const response = await axiosInstance.get<ApiResponse<ServiceQualityReport>>('/admin/reports/service-quality', {
      params,
    });
    return response.data;
  },
};
