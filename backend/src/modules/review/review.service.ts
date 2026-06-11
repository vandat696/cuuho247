import { IReview } from '@/shared/models/Review.model';
import { RescueRequest } from '@/shared/models/RescueRequest.model';
import { Company } from '@/shared/models/Company.model';
import { reviewRepository } from './review.repository';
import type { IReviewService, CreateReviewInput, ReplyReviewInput } from './interfaces/review.interface';
import { notificationService } from '../notification/notification.service';

export class ReviewService implements IReviewService {
  async createReview(userId: string, data: CreateReviewInput): Promise<IReview> {
    // 1. Check if rescue request exists and is completed
    const rescueRequest = await RescueRequest.findById(data.rescue_request_id);
    if (!rescueRequest) {
      throw new Error('Yêu cầu cứu hộ không tồn tại');
    }

    if (rescueRequest.user_id.toString() !== userId) {
      throw new Error('Bạn không có quyền đánh giá yêu cầu cứu hộ này');
    }

    if (rescueRequest.status !== 'completed') {
      throw new Error('Chỉ có thể đánh giá yêu cầu cứu hộ đã hoàn thành');
    }

    // 2. Check if a review already exists
    const existingReview = await reviewRepository.findByRequestId(data.rescue_request_id);
    if (existingReview) {
      throw new Error('Yêu cầu cứu hộ này đã được đánh giá');
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
    await Company.findByIdAndUpdate(companyId, {
      rating_avg: stats.rating_avg,
      rating_count: stats.rating_count,
    });

    // 5. Notify both company and customer
    try {
      // Notify Company
      await notificationService.createAndSendNotification(
        companyId,
        'company',
        'review_submitted',
        'Đánh giá mới',
        `Bạn đã nhận được đánh giá ${data.rating} sao mới từ khách hàng cho yêu cầu #${data.rescue_request_id.slice(-4)}.`,
        { rescue_request_id: data.rescue_request_id }
      );

      // Notify Customer
      await notificationService.createAndSendNotification(
        userId,
        'user',
        'review_submitted',
        'Đánh giá đã được gửi',
        'Cảm ơn bạn đã đánh giá dịch vụ của chúng tôi.',
        { rescue_request_id: data.rescue_request_id }
      );
    } catch (err) {
      console.error('Error creating review notifications:', err);
    }

    return newReview;
  }

  async getReviewByRequest(userId: string, userRole: string, requestId: string): Promise<IReview | null> {
    const review = await reviewRepository.findByRequestId(requestId);
    if (!review) {
      return null;
    }

    // Verify access
    if (userRole === 'customer' && review.user_id.toString() !== userId) {
      throw new Error('Bạn không có quyền xem đánh giá này');
    }

    if (userRole === 'company' && review.company_id.toString() !== userId) {
      throw new Error('Bạn không có quyền xem đánh giá này');
    }

    return review;
  }

  async replyToReview(companyId: string, reviewId: string, data: ReplyReviewInput): Promise<IReview> {
    const review = await reviewRepository.findById(reviewId);
    if (!review) {
      throw new Error('Đánh giá không tồn tại');
    }

    if (review.company_id.toString() !== companyId) {
      throw new Error('Bạn không có quyền phản hồi đánh giá này');
    }

    const updatedReview = await reviewRepository.updateReply(reviewId, data.content);
    if (!updatedReview) {
      throw new Error('Lỗi khi cập nhật phản hồi');
    }

    // Send notification to customer
    try {
      if (review.user_id) {
        await notificationService.createAndSendNotification(
          review.user_id.toString(),
          'user',
          'review_replied',
          'Phản hồi đánh giá',
          `Đơn vị cứu hộ đã phản hồi đánh giá của bạn cho yêu cầu #${review.rescue_request_id.toString().slice(-4)}.`,
          { rescue_request_id: review.rescue_request_id.toString() }
        );
      }
    } catch (err) {
      console.error('Error creating review reply notification:', err);
    }

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
