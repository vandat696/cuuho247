import { IAdmin } from '@/shared/models/Admin.model';

export interface IAdminRepository {
  findByEmail(email: string): Promise<IAdmin | null>;
  updateById(adminId: string, updateData: Partial<IAdmin>): Promise<IAdmin | null>;
}

export interface IAdminService {
  approveCompany(companyId: string, adminId: string, reason?: string): Promise<any>;
  rejectCompany(companyId: string, adminId: string, reason: string): Promise<any>;
  requestDocuments(companyId: string, adminId: string, reason: string): Promise<any>;
  getAuditLogs(limit?: number, skip?: number): Promise<{ logs: any[]; total: number }>;
  getReviews(limit?: number, page?: number): Promise<any>;
  removeReview(reviewId: string, adminId: string, reason: string): Promise<any>;
  removeReviewReply(reviewId: string, adminId: string, reason: string): Promise<any>;
  restoreReview(reviewId: string, adminId: string): Promise<any>;
  restoreReviewReply(reviewId: string, adminId: string): Promise<any>;
  getPendingCompanies(): Promise<any[]>;
  getUsers(search?: string, status?: string, limit?: number, page?: number): Promise<{ users: any[]; total: number }>;
  getUserById(userId: string): Promise<any>;
  lockUser(userId: string, adminId: string, reason: string): Promise<any>;
  unlockUser(userId: string, adminId: string, reason: string): Promise<any>;
  getUserLogs(userId: string): Promise<any[]>;
  getCompanies(
    search?: string,
    status?: string,
    limit?: number,
    page?: number
  ): Promise<{ companies: any[]; total: number }>;
  getCompanyById(companyId: string): Promise<any>;
  lockCompany(companyId: string, adminId: string, reason: string): Promise<any>;
  unlockCompany(companyId: string, adminId: string, reason: string): Promise<any>;
  getCompanyLogs(companyId: string): Promise<any[]>;
  getCommunityPosts(search?: string, page?: number, limit?: number): Promise<{ posts: any[]; total: number }>;
  getPostComments(postId: string): Promise<any[]>;
  removePost(postId: string, adminId: string, reason: string): Promise<any>;
  restorePost(postId: string, adminId: string): Promise<any>;
  removeComment(commentId: string, adminId: string, reason: string): Promise<any>;
  restoreComment(commentId: string, adminId: string): Promise<any>;
  getRescueActivitiesReport(
    startDateStr?: string,
    endDateStr?: string,
    serviceCategoryId?: string,
    groupBy?: 'day' | 'week' | 'month'
  ): Promise<any>;
  getAllCompanies(): Promise<any[]>;
  getServiceQualityReport(
    startDateStr?: string,
    endDateStr?: string,
    companyId?: string,
    groupBy?: 'day' | 'week' | 'month'
  ): Promise<any>;
}
