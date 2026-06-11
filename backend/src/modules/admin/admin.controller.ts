import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import adminService from './admin.service';

class AdminController {
  async getPendingCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await adminService.getPendingCompanies();
      res.status(200).json({ status: 'success', data: companies });
    } catch (err) {
      next(err);
    }
  }

  async approveCompany(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const company = await adminService.approveCompany(companyId, adminId, reason);

      const io = req.app.get('io');
      if (io) {
        io.to(`company:${companyId}`).emit('company_status_changed', {
          status: 'active',
          company,
        });
      }

      res.status(200).json({ status: 'success', message: 'Công ty đã được duyệt thành công', data: company });
    } catch (err) {
      next(err);
    }
  }

  async rejectCompany(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const company = await adminService.rejectCompany(companyId, adminId, reason);

      const io = req.app.get('io');
      if (io) {
        io.to(`company:${companyId}`).emit('company_status_changed', {
          status: 'rejected',
          company,
        });
      }

      res.status(200).json({ status: 'success', message: 'Hồ sơ công ty đã bị từ chối', data: company });
    } catch (err) {
      next(err);
    }
  }

  async requestDocuments(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const company = await adminService.requestDocuments(companyId, adminId, reason);

      const io = req.app.get('io');
      if (io) {
        io.to(`company:${companyId}`).emit('company_status_changed', {
          status: 'pending_verification',
          company,
        });
      }

      res.status(200).json({ status: 'success', message: 'Đã gửi yêu cầu chỉnh sửa giấy tờ', data: company });
    } catch (err) {
      next(err);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = parseInt(req.query.skip as string) || 0;
      const result = await adminService.getAuditLogs(limit, skip);
      res.status(200).json({ status: 'success', data: { logs: result.logs, total: result.total } });
    } catch (err) {
      next(err);
    }
  }

  async getReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const result = await adminService.getReviews(limit, page);
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  }

  async removeReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reviewId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const review = await adminService.removeReview(reviewId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Đã gỡ đánh giá thành công', data: review });
    } catch (err) {
      next(err);
    }
  }

  async removeReviewReply(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reviewId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const review = await adminService.removeReviewReply(reviewId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Đã gỡ phản hồi thành công', data: review });
    } catch (err) {
      next(err);
    }
  }

  async restoreReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reviewId } = req.params;
      const adminId = req.user?.id as string;
      const review = await adminService.restoreReview(reviewId, adminId);
      res.status(200).json({ status: 'success', message: 'Đã khôi phục đánh giá thành công', data: review });
    } catch (err) {
      next(err);
    }
  }

  async restoreReviewReply(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reviewId } = req.params;
      const adminId = req.user?.id as string;
      const review = await adminService.restoreReviewReply(reviewId, adminId);
      res.status(200).json({ status: 'success', message: 'Đã khôi phục phản hồi thành công', data: review });
    } catch (err) {
      next(err);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string;
      const status = req.query.status as string;
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const result = await adminService.getUsers(search, status, limit, page);
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await adminService.getUserById(userId);
      res.status(200).json({ status: 'success', data: user });
    } catch (err) {
      next(err);
    }
  }

  async lockUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const user = await adminService.lockUser(userId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Khóa tài khoản thành công', data: user });
    } catch (err) {
      next(err);
    }
  }

  async unlockUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const user = await adminService.unlockUser(userId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Mở khóa tài khoản thành công', data: user });
    } catch (err) {
      next(err);
    }
  }

  async getUserLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.params;
      const logs = await adminService.getUserLogs(userId);
      res.status(200).json({ status: 'success', data: logs });
    } catch (err) {
      next(err);
    }
  }

  async getCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string;
      const status = req.query.status as string;
      const limit = parseInt(req.query.limit as string) || 20;
      const page = parseInt(req.query.page as string) || 1;
      const result = await adminService.getCompanies(search, status, limit, page);
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  }

  async getCompanyById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const company = await adminService.getCompanyById(companyId);
      res.status(200).json({ status: 'success', data: company });
    } catch (err) {
      next(err);
    }
  }

  async lockCompany(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const company = await adminService.lockCompany(companyId, adminId, reason);

      const io = req.app.get('io');
      if (io) {
        io.to(`company:${companyId}`).emit('company_status_changed', {
          status: 'locked',
          company,
        });
      }

      res.status(200).json({ status: 'success', message: 'Khóa tài khoản công ty thành công', data: company });
    } catch (err) {
      next(err);
    }
  }

  async unlockCompany(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const company = await adminService.unlockCompany(companyId, adminId, reason);

      const io = req.app.get('io');
      if (io) {
        io.to(`company:${companyId}`).emit('company_status_changed', {
          status: 'active',
          company,
        });
      }

      res.status(200).json({ status: 'success', message: 'Mở khóa tài khoản công ty thành công', data: company });
    } catch (err) {
      next(err);
    }
  }

  async getCompanyLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const logs = await adminService.getCompanyLogs(companyId);
      res.status(200).json({ status: 'success', data: logs });
    } catch (err) {
      next(err);
    }
  }

  async getCommunityPosts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const search = req.query.search as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await adminService.getCommunityPosts(search, page, limit);
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      next(err);
    }
  }

  async getPostComments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const comments = await adminService.getPostComments(postId);
      res.status(200).json({ status: 'success', data: comments });
    } catch (err) {
      next(err);
    }
  }

  async removePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const post = await adminService.removePost(postId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Đã gỡ bài viết thành công', data: post });
    } catch (err) {
      next(err);
    }
  }

  async restorePost(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { postId } = req.params;
      const adminId = req.user?.id as string;
      const post = await adminService.restorePost(postId, adminId);
      res.status(200).json({ status: 'success', message: 'Đã khôi phục bài viết thành công', data: post });
    } catch (err) {
      next(err);
    }
  }

  async removeComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const comment = await adminService.removeComment(commentId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Đã gỡ bình luận thành công', data: comment });
    } catch (err) {
      next(err);
    }
  }

  async restoreComment(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { commentId } = req.params;
      const adminId = req.user?.id as string;
      const comment = await adminService.restoreComment(commentId, adminId);
      res.status(200).json({ status: 'success', message: 'Đã khôi phục bình luận thành công', data: comment });
    } catch (err) {
      next(err);
    }
  }

  async getRescueActivitiesReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const serviceCategoryId = req.query.serviceCategoryId as string | undefined;
      const groupBy = (req.query.groupBy as 'day' | 'week' | 'month' | undefined) || 'day';

      if (groupBy !== 'day' && groupBy !== 'week' && groupBy !== 'month') {
        res.status(400).json({
          status: 'error',
          message: 'Tham số groupBy không hợp lệ. Chỉ chấp nhận day, week hoặc month.',
        });
        return;
      }

      const report = await adminService.getRescueActivitiesReport(startDate, endDate, serviceCategoryId, groupBy);

      res.status(200).json({ status: 'success', data: report });
    } catch (err) {
      next(err);
    }
  }

  async getAllCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await adminService.getAllCompanies();
      res.status(200).json({ status: 'success', data: companies });
    } catch (err) {
      next(err);
    }
  }

  async getServiceQualityReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const companyId = req.query.companyId as string | undefined;
      const groupBy = (req.query.groupBy as 'day' | 'week' | 'month' | undefined) || 'day';

      if (groupBy !== 'day' && groupBy !== 'week' && groupBy !== 'month') {
        res.status(400).json({
          status: 'error',
          message: 'Tham số groupBy không hợp lệ. Chỉ chấp nhận day, week hoặc month.',
        });
        return;
      }

      const report = await adminService.getServiceQualityReport(startDate, endDate, companyId, groupBy);

      res.status(200).json({ status: 'success', data: report });
    } catch (err) {
      next(err);
    }
  }
}

export default new AdminController();
