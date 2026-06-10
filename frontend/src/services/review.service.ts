import { http as api } from './http';

export interface DetailedRatings {
  response_time?: number;
  service_quality?: number;
  staff_attitude?: number;
  pricing?: number;
}

export interface Review {
  _id: string;
  rescue_request_id: string;
  user_id: any;
  company_id: string;
  rating: number;
  detailed_ratings?: DetailedRatings;
  content?: string;
  is_visible: boolean;
  reply?: {
    content: string;
    replied_at: string;
    is_visible?: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateReviewPayload {
  rescue_request_id: string;
  rating: number;
  detailed_ratings?: DetailedRatings;
  content?: string;
}

export const reviewService = {
  createReview: async (data: CreateReviewPayload) => {
    const response = await api.post('/ratings', data);
    return response.data;
  },

  getReviewByRequest: async (requestId: string) => {
    const response = await api.get(`/ratings/request/${requestId}`);
    return response.data;
  },

  getCompanyReviews: async (companyId: string, page: number = 1, limit: number = 10) => {
    const response = await api.get(`/ratings/company/${companyId}?page=${page}&limit=${limit}`);
    return response.data;
  },

  replyToReview: async (reviewId: string, content: string) => {
    const response = await api.patch(`/ratings/${reviewId}/reply`, { content });
    return response.data;
  },
};
