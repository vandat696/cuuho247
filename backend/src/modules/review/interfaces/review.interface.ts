import { IReview } from '@/shared/models/Review.model';

export interface CreateReviewInput {
  rescue_request_id: string;
  rating: number;
  detailed_ratings?: {
    response_time?: number;
    service_quality?: number;
    staff_attitude?: number;
    pricing?: number;
  };
  content?: string;
}

export interface ReplyReviewInput {
  content: string;
}

export interface IReviewRepository {
  create(data: Partial<IReview>): Promise<IReview>;
  findById(id: string): Promise<IReview | null>;
  findByRequestId(requestId: string): Promise<IReview | null>;
  findByCompanyId(companyId: string, page?: number, limit?: number): Promise<{ reviews: IReview[]; total: number }>;
  findAllForAdmin(page?: number, limit?: number): Promise<{ reviews: IReview[]; total: number }>;
  updateReply(id: string, content: string): Promise<IReview | null>;
  calculateCompanyStats(companyId: string): Promise<{ rating_avg: number; rating_count: number }>;
}

export interface IReviewService {
  createReview(userId: string, data: CreateReviewInput): Promise<IReview>;
  getReviewByRequest(userId: string, userRole: string, requestId: string): Promise<IReview | null>;
  replyToReview(companyId: string, reviewId: string, data: ReplyReviewInput): Promise<IReview>;
  getCompanyReviews(companyId: string, page?: number, limit?: number): Promise<{ reviews: IReview[]; total: number }>;
}
