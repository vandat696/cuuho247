import { ApiError } from '@/shared/utils/apiError.util';
import { Company } from '@/shared/models/Company.model';
import { AdminLog } from '@/shared/models/AdminLog.model';
import { Notification } from '@/shared/models/Notification.model';
import { User } from '@/shared/models/User.model';
import { Review } from '@/shared/models/Review.model';
import { reviewRepository } from '../review/review.repository';

class AdminService {
  async approveCompany(companyId: string, adminId: string, reason?: string) {
    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Công ty không tồn tại');
    if (company.status === 'active') throw new ApiError(400, 'Công ty đã được duyệt');

    company.status = 'active';
    company.is_verified = true;
    company.rejection_reason = undefined;
    company.document_request_reason = undefined;
    await company.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'verify_company',
      target_type: 'company',
      target_id: company._id,
      details: { reason },
    });

    await Notification.create({
      recipient_type: 'company',
      recipient_id: company._id,
      type: 'company_approved',
      title: 'Tài khoản đã được phê duyệt',
      body: reason ? `Lý do: ${reason}` : 'Hồ sơ công ty của bạn đã được quản trị viên phê duyệt thành công.',
    });

    return company;
  }

  async rejectCompany(companyId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do từ chối là bắt buộc');

    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Công ty không tồn tại');

    company.status = 'rejected';
    company.is_verified = false;
    company.rejection_reason = reason;
    company.document_request_reason = undefined;
    await company.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'reject_company',
      target_type: 'company',
      target_id: company._id,
      details: { reason },
    });

    await Notification.create({
      recipient_type: 'company',
      recipient_id: company._id,
      type: 'company_rejected',
      title: 'Hồ sơ xác minh bị từ chối',
      body: `Hồ sơ công ty của bạn đã bị từ chối. Lý do: ${reason}`,
    });

    return company;
  }

  async requestDocuments(companyId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Yêu cầu bổ sung là bắt buộc');

    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Công ty không tồn tại');

    // Keep status as pending_verification but notify the company
    company.document_request_reason = reason;
    await company.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'request_more_docs',
      target_type: 'company',
      target_id: company._id,
      details: { reason },
    });

    await Notification.create({
      recipient_type: 'company',
      recipient_id: company._id,
      type: 'company_document_requested',
      title: 'Yêu cầu bổ sung giấy tờ',
      body: `Quản trị viên yêu cầu bổ sung thông tin/giấy tờ: ${reason}`,
    });

    return company;
  }

  async getAuditLogs(limit: number = 50, skip: number = 0) {
    const logs = await AdminLog.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('admin_id', 'full_name email');

    // Collect all target IDs by type
    const companyIds = logs.filter((log) => log.target_type === 'company').map((log) => log.target_id);

    const userIds = logs.filter((log) => log.target_type === 'user').map((log) => log.target_id);

    // Fetch details
    const [companies, users] = await Promise.all([
      Company.find({ _id: { $in: companyIds } }, 'company_name email'),
      User.find({ _id: { $in: userIds } }, 'full_name email'),
    ]);

    // Create maps for quick lookup
    const companyMap = new Map(companies.map((c) => [c._id.toString(), c]));
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    // Map logs to include target details
    const logsWithTargets = logs.map((log) => {
      const logObj = log.toObject();
      let targetName = '';

      if (log.target_type === 'company') {
        const comp = companyMap.get(log.target_id.toString());
        targetName = comp ? comp.company_name : 'Công ty đã bị xóa';
      } else if (log.target_type === 'user') {
        const usr = userMap.get(log.target_id.toString());
        targetName = usr ? usr.full_name : 'Người dùng đã bị xóa';
      }

      return {
        ...logObj,
        target_name: targetName || log.target_id.toString(),
      };
    });

    const total = await AdminLog.countDocuments();
    return { logs: logsWithTargets, total };
  }

  async getReviews(limit: number = 20, page: number = 1) {
    return await reviewRepository.findAllForAdmin(page, limit);
  }

  async removeReview(reviewId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do gỡ bỏ là bắt buộc');

    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Đánh giá không tồn tại');
    if (!review.is_visible) throw new ApiError(400, 'Đánh giá đã bị gỡ trước đó');

    review.is_visible = false;
    review.removed_by = adminId as any;
    review.removal_reason = reason;
    review.removed_at = new Date();
    await review.save();

    // Recalculate company stats since the review is removed
    const stats = await reviewRepository.calculateCompanyStats(review.company_id.toString());
    await Company.findByIdAndUpdate(review.company_id, {
      rating_avg: stats.rating_avg,
      rating_count: stats.rating_count,
    });

    await AdminLog.create({
      admin_id: adminId,
      action: 'remove_review',
      target_type: 'review',
      target_id: review._id,
      details: { reason, content: review.content },
    });

    await Notification.create({
      recipient_type: 'user',
      recipient_id: review.user_id,
      type: 'content_removed',
      title: 'Đánh giá của bạn đã bị gỡ',
      body: `Đánh giá của bạn đã bị quản trị viên gỡ bỏ khỏi hệ thống. Lý do: ${reason}`,
    });

    return review;
  }

  async removeReviewReply(reviewId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do gỡ bỏ là bắt buộc');

    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Đánh giá không tồn tại');
    if (!review.reply || !review.reply.content) throw new ApiError(400, 'Không có phản hồi nào để gỡ');
    if (review.reply.is_visible === false) throw new ApiError(400, 'Phản hồi đã bị gỡ trước đó');

    // Hide the reply instead of deleting it
    review.reply.is_visible = false;
    review.reply.removed_by = adminId as any;
    review.reply.removal_reason = reason;
    review.reply.removed_at = new Date();
    await review.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'remove_reply',
      target_type: 'review',
      target_id: review._id,
      details: { reason, content: review.reply.content },
    });

    await Notification.create({
      recipient_type: 'company',
      recipient_id: review.company_id,
      type: 'content_removed',
      title: 'Phản hồi đánh giá đã bị gỡ',
      body: `Phản hồi của công ty cho một đánh giá đã bị quản trị viên gỡ bỏ. Lý do: ${reason}`,
    });

    return review;
  }

  async restoreReview(reviewId: string, adminId: string) {
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Đánh giá không tồn tại');
    if (review.is_visible) throw new ApiError(400, 'Đánh giá đang hiển thị, không cần khôi phục');

    review.is_visible = true;
    review.removed_by = undefined;
    review.removal_reason = undefined;
    review.removed_at = undefined;
    await review.save();

    // Recalculate company stats since the review is restored
    const stats = await reviewRepository.calculateCompanyStats(review.company_id.toString());
    await Company.findByIdAndUpdate(review.company_id, {
      rating_avg: stats.rating_avg,
      rating_count: stats.rating_count,
    });

    await AdminLog.create({
      admin_id: adminId,
      action: 'restore_review',
      target_type: 'review',
      target_id: review._id,
    });

    return review;
  }

  async restoreReviewReply(reviewId: string, adminId: string) {
    const review = await Review.findById(reviewId);
    if (!review) throw new ApiError(404, 'Đánh giá không tồn tại');
    if (!review.reply || !review.reply.content) throw new ApiError(400, 'Không có phản hồi nào để khôi phục');
    if (review.reply.is_visible !== false) throw new ApiError(400, 'Phản hồi đang hiển thị, không cần khôi phục');

    review.reply.is_visible = true;
    review.reply.removed_by = undefined;
    review.reply.removal_reason = undefined;
    review.reply.removed_at = undefined;
    await review.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'restore_reply',
      target_type: 'review',
      target_id: review._id,
    });

    return review;
  }

  async getPendingCompanies() {
    return await Company.find({ status: 'pending_verification' }).sort({ updated_at: -1 });
  }
}

export default new AdminService();
