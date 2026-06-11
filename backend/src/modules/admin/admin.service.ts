import { ApiError } from '@/shared/utils/apiError.util';
import { Company } from '@/shared/models/Company.model';
import { AdminLog } from '@/shared/models/AdminLog.model';
import { Notification } from '@/shared/models/Notification.model';
import { User } from '@/shared/models/User.model';
import { Review } from '@/shared/models/Review.model';
import { reviewRepository } from '../review/review.repository';
import { CommunityPost } from '@/shared/models/CommunityPost.model';
import { CommunityPostComment } from '@/shared/models/CommunityPostComment.model';
import { RescueRequest } from '@/shared/models/RescueRequest.model';
import { ServiceCategory } from '@/shared/models/ServiceCategory.model';
import { Types } from 'mongoose';

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
    if (!reason) throw new ApiError(400, 'Yêu cầu chỉnh sửa là bắt buộc');

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
      title: 'Yêu cầu chỉnh sửa giấy tờ',
      body: `Quản trị viên yêu cầu chỉnh sửa thông tin/giấy tờ: ${reason}`,
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

  async getUsers(search?: string, status?: string, limit: number = 20, page: number = 1) {
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ full_name: regex }, { email: regex }, { phone: regex }];
    }
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(query).sort({ created_at: -1 }).skip(skip).limit(limit).exec(),
      User.countDocuments(query).exec(),
    ]);
    return { users, total };
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).exec();
    if (!user) throw new ApiError(404, 'Người dùng không tồn tại');
    return user;
  }

  async lockUser(userId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do khóa tài khoản là bắt buộc');
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'Người dùng không tồn tại');
    if (user.status === 'locked') throw new ApiError(400, 'Tài khoản người dùng đã bị khóa trước đó');

    user.status = 'locked';
    user.lock_reason = reason;
    await user.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'lock_user',
      target_type: 'user',
      target_id: user._id,
      reason,
      details: { reason },
    });

    return user;
  }

  async unlockUser(userId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do mở khóa tài khoản là bắt buộc');
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'Người dùng không tồn tại');
    if (user.status === 'active') throw new ApiError(400, 'Tài khoản người dùng đang hoạt động');

    user.status = 'active';
    user.lock_reason = undefined;
    await user.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'unlock_user',
      target_type: 'user',
      target_id: user._id,
      reason,
      details: { reason },
    });

    return user;
  }

  async getUserLogs(userId: string) {
    const logs = await AdminLog.find({ target_type: 'user', target_id: userId })
      .sort({ created_at: -1 })
      .populate('admin_id', 'full_name email')
      .exec();
    return logs;
  }

  async getCompanies(search?: string, status?: string, limit: number = 20, page: number = 1) {
    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ company_name: regex }, { email: regex }, { phone: regex }, { director_name: regex }];
    }
    const skip = (page - 1) * limit;
    const [companies, total] = await Promise.all([
      Company.find(query).sort({ created_at: -1 }).skip(skip).limit(limit).exec(),
      Company.countDocuments(query).exec(),
    ]);
    return { companies, total };
  }

  async getCompanyById(companyId: string) {
    const company = await Company.findById(companyId).exec();
    if (!company) throw new ApiError(404, 'Công ty cứu hộ không tồn tại');
    return company;
  }

  async lockCompany(companyId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do khóa tài khoản là bắt buộc');
    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Công ty cứu hộ không tồn tại');
    if (company.status === 'locked') throw new ApiError(400, 'Tài khoản công ty đã bị khóa trước đó');

    company.status = 'locked';
    company.lock_reason = reason;
    await company.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'lock_company',
      target_type: 'company',
      target_id: company._id,
      reason,
      details: { reason },
    });

    return company;
  }

  async unlockCompany(companyId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do mở khóa tài khoản là bắt buộc');
    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Công ty cứu hộ không tồn tại');
    if (company.status === 'active') throw new ApiError(400, 'Tài khoản công ty đang hoạt động');

    company.status = 'active';
    company.lock_reason = undefined;
    await company.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'unlock_company',
      target_type: 'company',
      target_id: company._id,
      reason,
      details: { reason },
    });

    return company;
  }

  async getCompanyLogs(companyId: string) {
    const logs = await AdminLog.find({ target_type: 'company', target_id: companyId })
      .sort({ created_at: -1 })
      .populate('admin_id', 'full_name email')
      .exec();
    return logs;
  }

  async getCommunityPosts(search?: string, page: number = 1, limit: number = 20) {
    const query: any = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ title: regex }, { content: regex }];
    }
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      CommunityPost.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user_id', 'full_name company_name avatar_url role')
        .populate('tags', 'name')
        .exec(),
      CommunityPost.countDocuments(query).exec(),
    ]);
    return { posts, total };
  }

  async getPostComments(postId: string) {
    const comments = await CommunityPostComment.find({ post_id: postId })
      .sort({ created_at: -1 })
      .populate('user_id', 'full_name company_name avatar_url role')
      .exec();
    return comments;
  }

  async removePost(postId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do gỡ bài viết là bắt buộc');
    const post = await CommunityPost.findById(postId);
    if (!post) throw new ApiError(404, 'Bài viết không tồn tại');
    if (!post.is_visible) throw new ApiError(400, 'Bài viết đã bị gỡ trước đó');

    post.is_visible = false;
    post.removed_by = adminId as any;
    post.removal_reason = reason;
    post.removed_at = new Date();
    await post.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'remove_post',
      target_type: 'post',
      target_id: post._id,
      details: { reason, title: post.title },
    });

    return post;
  }

  async restorePost(postId: string, adminId: string) {
    const post = await CommunityPost.findById(postId);
    if (!post) throw new ApiError(404, 'Bài viết không tồn tại');
    if (post.is_visible) throw new ApiError(400, 'Bài viết đang hiển thị, không cần khôi phục');

    post.is_visible = true;
    post.removed_by = undefined;
    post.removal_reason = undefined;
    post.removed_at = undefined;
    await post.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'restore_post',
      target_type: 'post',
      target_id: post._id,
    });

    return post;
  }

  async removeComment(commentId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do gỡ bình luận là bắt buộc');
    const comment = await CommunityPostComment.findById(commentId);
    if (!comment) throw new ApiError(404, 'Bình luận không tồn tại');
    if (!comment.is_visible) throw new ApiError(400, 'Bình luận đã bị gỡ trước đó');

    comment.is_visible = false;
    comment.removed_by = adminId as any;
    comment.removal_reason = reason;
    comment.removed_at = new Date();
    await comment.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'remove_comment',
      target_type: 'comment',
      target_id: comment._id,
      details: { reason, content: comment.content },
    });

    return comment;
  }

  async restoreComment(commentId: string, adminId: string) {
    const comment = await CommunityPostComment.findById(commentId);
    if (!comment) throw new ApiError(404, 'Bình luận không tồn tại');
    if (comment.is_visible) throw new ApiError(400, 'Bình luận đang hiển thị, không cần khôi phục');

    comment.is_visible = true;
    comment.removed_by = undefined;
    comment.removal_reason = undefined;
    comment.removed_at = undefined;
    await comment.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'restore_comment',
      target_type: 'comment',
      target_id: comment._id,
    });

    return comment;
  }

  async getRescueActivitiesReport(
    startDateStr?: string,
    endDateStr?: string,
    serviceCategoryId?: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ) {
    const { startBoundary, endBoundary } = this.parseDateBoundaries(startDateStr, endDateStr);

    // 2. Fetch all service categories first (to map category names)
    const categories = await ServiceCategory.find().lean().exec();
    const categoryMap = new Map(categories.map((c) => [c._id.toString(), c.name]));

    // 3. Build match query for database
    const matchQuery: any = {
      created_at: { $gte: startBoundary, $lte: endBoundary },
    };

    if (serviceCategoryId) {
      // Validate serviceCategoryId format
      if (!Types.ObjectId.isValid(serviceCategoryId)) {
        throw new ApiError(400, 'ID danh mục dịch vụ không hợp lệ');
      }
      matchQuery.service_types = new Types.ObjectId(serviceCategoryId);
    }

    // 4. Fetch requests with only relevant fields
    const requests = await RescueRequest.find(matchQuery, 'created_at status service_types payment').lean().exec();

    // 5. Calculate overall summary statistics
    const totalRequests = requests.length;
    const completedRequests = requests.filter((r) => r.status === 'completed').length;
    const cancelledRequests = requests.filter((r) =>
      ['cancelled', 'rejected', 'timeout'].includes(r.status || '')
    ).length;
    const successRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 10000) / 100 : 0;
    const totalRevenue = requests
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + (r.payment?.amount || 0), 0);

    // 6. Calculate status breakdown
    const statusCounts: Record<string, number> = {};
    requests.forEach((r) => {
      const status = r.status || 'unknown';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    const statusStats = Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));

    // 7. Calculate service types breakdown
    const serviceCounts: Record<string, number> = {};
    // Initialize all active categories with 0 count
    categories.forEach((cat) => {
      serviceCounts[cat._id.toString()] = 0;
    });

    requests.forEach((r) => {
      if (r.service_types && Array.isArray(r.service_types)) {
        r.service_types.forEach((typeId) => {
          const idStr = typeId.toString();
          if (idStr in serviceCounts) {
            serviceCounts[idStr] += 1;
          } else {
            serviceCounts[idStr] = 1;
          }
        });
      }
    });

    const serviceTypeStats = Object.entries(serviceCounts)
      .map(([id, count]) => {
        const name = categoryMap.get(id) || 'Khác/Chưa phân loại';
        const percentage = totalRequests > 0 ? Math.round((count / totalRequests) * 10000) / 100 : 0;
        return {
          categoryId: id,
          name,
          count,
          percentage,
        };
      })
      .sort((a, b) => b.count - a.count);

    // 8. Generate time-series keys for gap filling
    const timeKeys = this.generateTimeKeys(startBoundary, endBoundary, groupBy);
    const timeSeriesMap: Record<string, { count: number; completed: number; cancelled: number }> = {};

    timeKeys.forEach((key) => {
      timeSeriesMap[key] = { count: 0, completed: 0, cancelled: 0 };
    });

    requests.forEach((r) => {
      const key = this.formatDateTimeKey(r.created_at as Date, groupBy);
      if (!timeSeriesMap[key]) {
        timeSeriesMap[key] = { count: 0, completed: 0, cancelled: 0 };
      }
      timeSeriesMap[key].count += 1;
      if (r.status === 'completed') {
        timeSeriesMap[key].completed += 1;
      } else if (['cancelled', 'rejected', 'timeout'].includes(r.status || '')) {
        timeSeriesMap[key].cancelled += 1;
      }
    });

    const timeSeries = Object.entries(timeSeriesMap)
      .map(([date, stats]) => ({
        date,
        ...stats,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      summary: {
        totalRequests,
        completedRequests,
        cancelledRequests,
        successRate,
        totalRevenue,
      },
      serviceTypeStats,
      statusStats,
      timeSeries,
    };
  }

  async getAllCompanies() {
    return await Company.find({ status: 'active' }, '_id company_name').lean().exec();
  }

  async getServiceQualityReport(
    startDateStr?: string,
    endDateStr?: string,
    companyId?: string,
    groupBy: 'day' | 'week' | 'month' = 'day'
  ) {
    const { startBoundary, endBoundary } = this.parseDateBoundaries(startDateStr, endDateStr);

    // 2. Fetch active companies to build lookup or compare
    const activeCompanies = await Company.find({ status: 'active' }, '_id company_name').lean().exec();
    const companyNameMap = new Map(activeCompanies.map((c) => [c._id.toString(), c.company_name]));

    // 3. Build match queries
    const requestMatch: any = {
      created_at: { $gte: startBoundary, $lte: endBoundary },
    };
    const reviewMatch: any = {
      created_at: { $gte: startBoundary, $lte: endBoundary },
      is_visible: { $ne: false },
    };

    if (companyId) {
      if (!Types.ObjectId.isValid(companyId)) {
        throw new ApiError(400, 'ID công ty cứu hộ không hợp lệ');
      }
      requestMatch['company.company_id'] = new Types.ObjectId(companyId);
      reviewMatch.company_id = new Types.ObjectId(companyId);
    }

    // 4. Fetch requests and reviews with minimal fields
    const requests = await RescueRequest.find(
      requestMatch,
      'created_at status company.company_id company.company_name accepted_at'
    )
      .lean()
      .exec();

    const reviews = await Review.find(reviewMatch, 'created_at rating detailed_ratings company_id').lean().exec();

    // 5. Generate time-series keys for gap filling
    const timeKeys = this.generateTimeKeys(startBoundary, endBoundary, groupBy);

    // 6. Calculate statistics
    if (companyId) {
      // Specific Company View
      const baseStats = this.calculateBaseStats(requests, reviews);
      const { totalReviews } = baseStats;

      // Detailed ratings calculation
      const detailedRatingsAvg = {
        response_time: 0,
        service_quality: 0,
        staff_attitude: 0,
        pricing: 0,
      };

      if (totalReviews > 0) {
        let countRT = 0,
          countSQ = 0,
          countSA = 0,
          countP = 0;
        let sumRT = 0,
          sumSQ = 0,
          sumSA = 0,
          sumP = 0;

        reviews.forEach((r) => {
          if (r.detailed_ratings) {
            if (r.detailed_ratings.response_time) {
              sumRT += r.detailed_ratings.response_time;
              countRT++;
            }
            if (r.detailed_ratings.service_quality) {
              sumSQ += r.detailed_ratings.service_quality;
              countSQ++;
            }
            if (r.detailed_ratings.staff_attitude) {
              sumSA += r.detailed_ratings.staff_attitude;
              countSA++;
            }
            if (r.detailed_ratings.pricing) {
              sumP += r.detailed_ratings.pricing;
              countP++;
            }
          }
        });

        detailedRatingsAvg.response_time = countRT > 0 ? Math.round((sumRT / countRT) * 10) / 10 : 0;
        detailedRatingsAvg.service_quality = countSQ > 0 ? Math.round((sumSQ / countSQ) * 10) / 10 : 0;
        detailedRatingsAvg.staff_attitude = countSA > 0 ? Math.round((sumSA / countSA) * 10) / 10 : 0;
        detailedRatingsAvg.pricing = countP > 0 ? Math.round((sumP / countP) * 10) / 10 : 0;
      }

      // Construct specific company time series
      const timeSeries = this.calculateTimeSeries(requests, reviews, timeKeys, groupBy);

      return {
        summary: {
          ...baseStats,
          detailedRatingsAvg,
        },
        timeSeries,
      };
    } else {
      // General All Companies View
      const baseStats = this.calculateBaseStats(requests, reviews);

      // Group by company
      const companyStatsMap: Record<
        string,
        {
          totalRequests: number;
          respondedRequests: number;
          acceptedRequestsCount: number;
          totalResponseTime: number;
          ratingSum: number;
          reviewCount: number;
        }
      > = {};

      activeCompanies.forEach((comp) => {
        companyStatsMap[comp._id.toString()] = {
          totalRequests: 0,
          respondedRequests: 0,
          acceptedRequestsCount: 0,
          totalResponseTime: 0,
          ratingSum: 0,
          reviewCount: 0,
        };
      });

      requests.forEach((r) => {
        if (r.company && r.company.company_id) {
          const compIdStr = r.company.company_id.toString();
          if (!companyStatsMap[compIdStr]) {
            companyStatsMap[compIdStr] = {
              totalRequests: 0,
              respondedRequests: 0,
              acceptedRequestsCount: 0,
              totalResponseTime: 0,
              ratingSum: 0,
              reviewCount: 0,
            };
          }
          const cStat = companyStatsMap[compIdStr];
          cStat.totalRequests += 1;
          if (r.status !== 'pending' && r.status !== 'timeout') {
            cStat.respondedRequests += 1;
          }
          if (r.accepted_at) {
            cStat.acceptedRequestsCount += 1;
            const diffMs = (r.accepted_at as Date).getTime() - (r.created_at as Date).getTime();
            cStat.totalResponseTime += Math.max(diffMs / 60000, 0);
          }
        }
      });

      reviews.forEach((r) => {
        if (r.company_id) {
          const compIdStr = r.company_id.toString();
          if (!companyStatsMap[compIdStr]) {
            companyStatsMap[compIdStr] = {
              totalRequests: 0,
              respondedRequests: 0,
              acceptedRequestsCount: 0,
              totalResponseTime: 0,
              ratingSum: 0,
              reviewCount: 0,
            };
          }
          const cStat = companyStatsMap[compIdStr];
          cStat.reviewCount += 1;
          cStat.ratingSum += r.rating;
        }
      });

      const companyBreakdown = Object.entries(companyStatsMap)
        .map(([id, stat]) => {
          const name = companyNameMap.get(id) || 'Đơn vị đã hủy kích hoạt';
          const rate =
            stat.totalRequests > 0 ? Math.round((stat.respondedRequests / stat.totalRequests) * 10000) / 100 : 0;
          const avgRespTime =
            stat.acceptedRequestsCount > 0
              ? Math.round((stat.totalResponseTime / stat.acceptedRequestsCount) * 10) / 10
              : 0;
          const avg = stat.reviewCount > 0 ? Math.round((stat.ratingSum / stat.reviewCount) * 100) / 100 : 0;

          return {
            companyId: id,
            companyName: name,
            totalRequests: stat.totalRequests,
            responseRate: rate,
            avgResponseTime: avgRespTime,
            avgRating: avg,
            reviewCount: stat.reviewCount,
          };
        })
        .sort((a, b) => b.avgRating - a.avgRating || b.totalRequests - a.totalRequests);

      // System-wide time series
      const timeSeries = this.calculateTimeSeries(requests, reviews, timeKeys, groupBy);

      return {
        summary: baseStats,
        companyBreakdown,
        timeSeries,
      };
    }
  }

  private formatDateTimeKey(date: Date, groupBy: 'day' | 'week' | 'month'): string {
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const year = vnDate.getUTCFullYear();
    const month = vnDate.getUTCMonth() + 1;
    const day = vnDate.getUTCDate();

    if (groupBy === 'month') {
      return `${year}-${String(month).padStart(2, '0')}`;
    } else if (groupBy === 'week') {
      const utcdai = vnDate.getUTCDay();
      const diffToMonday = utcdai === 0 ? -6 : 1 - utcdai;
      const monday = new Date(vnDate.getTime() + diffToMonday * 24 * 60 * 60 * 1000);
      return `${monday.getUTCFullYear()}-${String(monday.getUTCMonth() + 1).padStart(2, '0')}-${String(monday.getUTCDate()).padStart(2, '0')}`;
    } else {
      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }
  }

  private generateTimeKeys(start: Date, end: Date, groupBy: 'day' | 'week' | 'month'): string[] {
    const keys: string[] = [];
    let current = new Date(start.getTime());

    if (groupBy === 'month') {
      while (current <= end) {
        keys.push(this.formatDateTimeKey(current, 'month'));
        const vnDate = new Date(current.getTime() + 7 * 60 * 60 * 1000);
        const nextMonthVN = new Date(Date.UTC(vnDate.getUTCFullYear(), vnDate.getUTCMonth() + 1, 1));
        current = new Date(nextMonthVN.getTime() - 7 * 60 * 60 * 1000);
      }
    } else if (groupBy === 'week') {
      const vnDate = new Date(current.getTime() + 7 * 60 * 60 * 1000);
      const day = vnDate.getUTCDay();
      const diffToMonday = day === 0 ? -6 : 1 - day;
      const monday = new Date(vnDate.getTime() + diffToMonday * 24 * 60 * 60 * 1000);
      current = new Date(monday.getTime() - 7 * 60 * 60 * 1000);

      while (current <= end) {
        keys.push(this.formatDateTimeKey(current, 'week'));
        current = new Date(current.getTime() + 7 * 24 * 60 * 60 * 1000);
      }
    } else {
      while (current <= end) {
        keys.push(this.formatDateTimeKey(current, 'day'));
        current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
      }
    }

    return Array.from(new Set(keys));
  }

  private parseDateBoundaries(startDateStr?: string, endDateStr?: string): { startBoundary: Date; endBoundary: Date } {
    let end = new Date();
    let start = new Date();
    start.setDate(end.getDate() - 6);

    if (startDateStr) {
      const parsedStart = new Date(startDateStr);
      if (isNaN(parsedStart.getTime())) {
        throw new ApiError(400, 'Ngày bắt đầu không đúng định dạng');
      }
      start = parsedStart;
    }

    if (endDateStr) {
      const parsedEnd = new Date(endDateStr);
      if (isNaN(parsedEnd.getTime())) {
        throw new ApiError(400, 'Ngày kết thúc không đúng định dạng');
      }
      end = parsedEnd;
    }

    const startBoundary = new Date(start);
    startBoundary.setHours(0, 0, 0, 0);

    const endBoundary = new Date(end);
    endBoundary.setHours(23, 59, 59, 999);

    if (startBoundary > endBoundary) {
      throw new ApiError(400, 'Ngày bắt đầu không được lớn hơn ngày kết thúc');
    }

    const maxRangeMs = 366 * 24 * 60 * 60 * 1000;
    if (endBoundary.getTime() - startBoundary.getTime() > maxRangeMs) {
      throw new ApiError(400, 'Khoảng thời gian vượt quá giới hạn cho phép (366 ngày)');
    }

    return { startBoundary, endBoundary };
  }

  private calculateTimeSeries(requests: any[], reviews: any[], timeKeys: string[], groupBy: 'day' | 'week' | 'month') {
    const timeSeriesMap: Record<
      string,
      { totalRequests: number; respondedRequests: number; ratingSum: number; reviewCount: number }
    > = {};
    timeKeys.forEach((key) => {
      timeSeriesMap[key] = { totalRequests: 0, respondedRequests: 0, ratingSum: 0, reviewCount: 0 };
    });

    requests.forEach((r) => {
      const key = this.formatDateTimeKey(r.created_at as Date, groupBy);
      if (!timeSeriesMap[key]) {
        timeSeriesMap[key] = { totalRequests: 0, respondedRequests: 0, ratingSum: 0, reviewCount: 0 };
      }
      timeSeriesMap[key].totalRequests += 1;
      if (r.status !== 'pending' && r.status !== 'timeout') {
        timeSeriesMap[key].respondedRequests += 1;
      }
    });

    reviews.forEach((r) => {
      const key = this.formatDateTimeKey(r.created_at as Date, groupBy);
      if (!timeSeriesMap[key]) {
        timeSeriesMap[key] = { totalRequests: 0, respondedRequests: 0, ratingSum: 0, reviewCount: 0 };
      }
      timeSeriesMap[key].reviewCount += 1;
      timeSeriesMap[key].ratingSum += r.rating;
    });

    return Object.entries(timeSeriesMap)
      .map(([date, val]) => {
        const rate = val.totalRequests > 0 ? Math.round((val.respondedRequests / val.totalRequests) * 10000) / 100 : 0;
        const avg = val.reviewCount > 0 ? Math.round((val.ratingSum / val.reviewCount) * 100) / 100 : 0;
        return {
          date,
          totalRequests: val.totalRequests,
          responseRate: rate,
          avgRating: avg,
          reviewCount: val.reviewCount,
        };
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateBaseStats(requests: any[], reviews: any[]) {
    const totalRequests = requests.length;
    const respondedRequests = requests.filter((r) => r.status !== 'pending' && r.status !== 'timeout').length;
    const responseRate = totalRequests > 0 ? Math.round((respondedRequests / totalRequests) * 10000) / 100 : 0;

    const acceptedRequests = requests.filter((r) => r.accepted_at);
    let avgResponseTime = 0;
    if (acceptedRequests.length > 0) {
      const totalDuration = acceptedRequests.reduce((sum, r) => {
        const diffMs = (r.accepted_at as Date).getTime() - (r.created_at as Date).getTime();
        return sum + Math.max(diffMs / 60000, 0);
      }, 0);
      avgResponseTime = Math.round((totalDuration / acceptedRequests.length) * 10) / 10;
    }

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0 ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 100) / 100 : 0;

    return {
      totalRequests,
      respondedRequests,
      responseRate,
      avgResponseTime,
      totalReviews,
      avgRating,
    };
  }
}

export default new AdminService();
