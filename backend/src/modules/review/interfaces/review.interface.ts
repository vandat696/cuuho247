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
