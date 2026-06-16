import { IReview } from '@/shared/models/Review.model';
import rescueRepository from '../rescue/rescue.repository';
import companyRepository from '../company/company.repository';
import { reviewRepository } from './review.repository';
import type { CreateReviewInput, ReplyReviewInput } from './interfaces/review.interface';
import { NotFoundError, ForbiddenError, BadRequestError, InternalServerError } from '@/shared/utils/apiError.util';
import { reviewEventEmitter, REVIEW_EVENTS } from './review.event';

export class ReviewService {
  async createReview(userId: string, data: CreateReviewInput): Promise<IReview> {
    // 1. Check if rescue request exists and is completed
    const rescueRequest = await rescueRepository.findById(data.rescue_request_id);
    if (!rescueRequest) {
      throw new NotFoundError('Yêu cầu cứu hộ không tồn tại');
    }

    if (rescueRequest.user_id.toString() !== userId) {
      throw new ForbiddenError('Bạn không có quyền đánh giá yêu cầu cứu hộ này');
    }

    if (rescueRequest.status !== 'completed') {
      throw new BadRequestError('Chỉ có thể đánh giá yêu cầu cứu hộ đã hoàn thành');
    }

    // 2. Check if a review already exists
    const existingReview = await reviewRepository.findByRequestId(data.rescue_request_id);
    if (existingReview) {
      throw new BadRequestError('Yêu cầu cứu hộ này đã được đánh giá');
    }

    // 3. Create the review
    const companyId = rescueRequest.company.company_id.toString();
    const newReview = await reviewRepository.create({
      rescue_request_id: data.rescue_request_id as any,
      user_id: userId as any,
      company_id: companyId as any,
      rating: data.rating,
      detailed_ratings: data.detailed_ratings,
      content: data.content,
      is_visible: true,
    });

    // 4. Update company average rating
    const stats = await reviewRepository.calculateCompanyStats(companyId);
    await companyRepository.updateById(companyId, {
      rating_avg: stats.rating_avg,
      rating_count: stats.rating_count,
    });

    // 5. Emit domain event for side-effects (Notifications)
    reviewEventEmitter.emit(REVIEW_EVENTS.REVIEW_SUBMITTED, {
      companyId,
      userId,
      rating: data.rating,
      rescueRequestId: data.rescue_request_id,
    });

    await newReview.populate('user_id', 'full_name avatar_url');

    return newReview;
  }

  async getReviewByRequest(userId: string, userRole: string, requestId: string): Promise<IReview | null> {
    const review = await reviewRepository.findByRequestId(requestId);
    if (!review) {
      return null;
    }

    // Verify access
    if (userRole === 'customer' && review.user_id.toString() !== userId) {
      throw new ForbiddenError('Bạn không có quyền xem đánh giá này');
    }

    if (userRole === 'company' && review.company_id.toString() !== userId) {
      throw new ForbiddenError('Bạn không có quyền xem đánh giá này');
    }

    return review;
  }

  async replyToReview(companyId: string, reviewId: string, data: ReplyReviewInput): Promise<IReview> {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Đánh giá không tồn tại');
    }

    if (review.company_id.toString() !== companyId) {
      throw new ForbiddenError('Bạn không có quyền phản hồi đánh giá này');
    }

    const updatedReview = await reviewRepository.updateReply(reviewId, data.content);
    if (!updatedReview) {
      throw new InternalServerError('Lỗi khi cập nhật phản hồi');
    }

    // Emit domain event for side-effects (Notifications)
    reviewEventEmitter.emit(REVIEW_EVENTS.REVIEW_REPLIED, {
      userId: review.user_id ? review.user_id.toString() : '',
      rescueRequestId: review.rescue_request_id.toString(),
    });

    await updatedReview.populate('user_id', 'full_name avatar_url');

    return updatedReview;
  }

  async getCompanyReviews(
    companyId: string,
    page?: number,
    limit?: number
  ): Promise<{ reviews: IReview[]; total: number }> {
    return reviewRepository.findByCompanyId(companyId, page, limit);
  }
}

export const reviewService = new ReviewService();
