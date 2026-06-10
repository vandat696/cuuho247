import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Pagination } from '@mui/material';
import { toast } from 'react-hot-toast';
import { reviewService, Review } from '../../services/review.service';
import { CompanyReviewItem } from '../../components/rescue-company/review/CompanyReviewItem';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';

export const CompanyReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const limit = 10;
  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    const fetchReviews = async () => {
      if (!companyId) return;
      try {
        setIsLoading(true);
        const res = await reviewService.getCompanyReviews(companyId, page, limit);
        setReviews(res.data.reviews || []);
        setTotal(res.data.total || 0);
      } catch (error) {
        toast.error('Lỗi khi tải danh sách đánh giá');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [companyId, page]);

  const handleReplySuccess = (updatedReview: Review) => {
    setReviews((prev) => prev.map((r) => (r._id === updatedReview._id ? updatedReview : r)));
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <MobileLayout>
      <AppHeader title="Quản lý đánh giá" backFallback="/company/home" />
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#f1f5f9', p: 2 }}>
        {isLoading && page === 1 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, px: 1 }}>
              Xem và phản hồi đánh giá từ khách hàng ({total} đánh giá)
            </Typography>

            {reviews.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 4, bgcolor: '#ffffff', borderRadius: 2 }}>
                <Typography color="text.secondary">Chưa có đánh giá nào.</Typography>
              </Box>
            ) : (
              <>
                {reviews.map((review) => (
                  <CompanyReviewItem key={review._id} review={review} onReplySuccess={handleReplySuccess} />
                ))}

                {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                    <Pagination count={totalPages} page={page} onChange={(_, val) => setPage(val)} color="primary" />
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
};

export default CompanyReviewsPage;
