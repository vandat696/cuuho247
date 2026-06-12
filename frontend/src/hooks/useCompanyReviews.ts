import { useState, useCallback } from 'react';
import { reviewService } from '@/services/review.service';

export function useCompanyReviews(companyId: string) {
  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res = await reviewService.getCompanyReviews(companyId, 1, 20);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.error('Error fetching company reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  }, [companyId]);

  const openReviews = useCallback(() => {
    setIsReviewsModalOpen(true);
    if (reviews.length === 0) {
      fetchReviews();
    }
  }, [reviews.length, fetchReviews]);

  const closeReviews = useCallback(() => {
    setIsReviewsModalOpen(false);
  }, []);

  return {
    reviews,
    loadingReviews,
    isReviewsModalOpen,
    openReviews,
    closeReviews,
  };
}
