import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';

import { ReviewHeader } from '../../components/rescue-customer/review/ReviewHeader';
import { OverallRatingCard } from '../../components/rescue-customer/review/OverallRatingCard';
import { DetailedRatingSection } from '../../components/rescue-customer/review/DetailedRatingSection';
import { ReviewInputForm } from '../../components/rescue-customer/review/ReviewInputForm';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';

import { reviewService, DetailedRatings } from '../../services/review.service';
import { customerRescueService, CustomerRescueRequest } from '../../services/customer-rescue.service';

export const CustomerReviewPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [request, setRequest] = useState<CustomerRescueRequest | null>(null);
  const [existingReview, setExistingReview] = useState<any>(null);

  const [rating, setRating] = useState<number | null>(null);
  const [detailedRatings, setDetailedRatings] = useState<DetailedRatings>({});
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!requestId) return;
      try {
        setIsLoading(true);

        const response = await customerRescueService.getMyRequests();
        const foundRequest = response.data.requests.find((r) => r._id === requestId);

        if (!foundRequest) {
          toast.error('Không tìm thấy yêu cầu cứu hộ');
          navigate(-1);
          return;
        }

        if (foundRequest.status !== 'completed') {
          toast.error('Chỉ có thể đánh giá yêu cầu cứu hộ đã hoàn thành');
          navigate(-1);
          return;
        }

        setRequest(foundRequest);

        try {
          const reviewData = await reviewService.getReviewByRequest(requestId);
          if (reviewData && reviewData.data) {
            setExistingReview(reviewData.data);
            setRating(reviewData.data.rating);
            setDetailedRatings(reviewData.data.detailed_ratings || {});
            setContent(reviewData.data.content || '');
          }
        } catch (error: any) {
          if (error.response?.status !== 404) {
            console.error('Failed to fetch existing review:', error);
          }
        }
      } catch (error) {
        toast.error('Lỗi khi tải thông tin');
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [requestId, navigate]);

  const handleRatingChange = (field: keyof DetailedRatings, newValue: number | null) => {
    if (newValue === null) return;
    setDetailedRatings((prev) => ({ ...prev, [field]: newValue }));
  };

  const handleSubmit = async () => {
    if (!requestId) return;
    if (!rating) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    try {
      setIsSubmitting(true);
      await reviewService.createReview({
        rescue_request_id: requestId,
        rating,
        detailed_ratings: detailedRatings,
        content,
      });
      toast.success('Gửi đánh giá thành công! Cảm ơn bạn.');
      navigate('/customer/history');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi gửi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <AppHeader title="Đánh giá dịch vụ" backFallback="/customer/history" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Box>
      </MobileLayout>
    );
  }

  if (!request) return null;

  const companyName = request.company.company_name || 'Đơn vị cứu hộ';
  const hasReviewed = !!existingReview;

  return (
    <MobileLayout>
      <AppHeader title="Đánh giá dịch vụ" backFallback="/customer/history" />
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#f1f5f9', py: 3, px: 2 }}>
        <Box sx={{ maxWidth: 'sm', mx: 'auto' }}>
          <ReviewHeader />

          <OverallRatingCard
            companyName={companyName}
            rating={rating || 0}
            onRatingChange={(v) => setRating(v)}
            disabled={hasReviewed}
          />

          <DetailedRatingSection ratings={detailedRatings} onRatingChange={handleRatingChange} disabled={hasReviewed} />

          <ReviewInputForm
            content={content}
            onContentChange={setContent}
            onSubmit={handleSubmit}
            onCancel={() => navigate(-1)}
            isSubmitting={isSubmitting}
            disabled={hasReviewed}
          />

          {hasReviewed && existingReview.reply && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f0fdf4', borderRadius: 2, border: '1px solid #bbf7d0' }}>
              <Typography variant="subtitle2" sx={{ color: '#166534', mb: 0.5, fontWeight: 600 }}>
                Phản hồi từ {companyName}
              </Typography>
              <Typography variant="body2" sx={{ color: '#14532d' }}>
                {existingReview.reply.content}
              </Typography>
            </Box>
          )}

          {hasReviewed && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                Bạn đã đánh giá dịch vụ này
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default CustomerReviewPage;
