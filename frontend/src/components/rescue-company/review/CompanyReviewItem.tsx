import { useState } from 'react';
import { Box, Typography, Rating, Avatar, Divider, Button } from '@mui/material';
import { Review, reviewService } from '../../../services/review.service';
import { CompanyReplyForm } from './CompanyReplyForm';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CompanyReviewItemProps {
  review: Review;
  onReplySuccess: (updatedReview: Review) => void;
}

export const CompanyReviewItem = ({ review, onReplySuccess }: CompanyReviewItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const customerName = review.user_id?.full_name || 'Khách hàng';
  const customerAvatar = review.user_id?.avatar_url;

  const handleReplySubmit = async () => {
    if (!replyContent.trim()) return;
    try {
      setIsSubmitting(true);
      const res = await reviewService.replyToReview(review._id, replyContent.trim());
      toast.success('Gửi phản hồi thành công');
      setIsReplying(false);
      onReplySuccess(res.data);
    } catch (error: any) {
      console.error('Error replying to review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ mb: 3, p: 2, border: '1px solid #e2e8f0', borderRadius: 2, bgcolor: 'white' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Avatar src={customerAvatar} alt={customerName} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {customerName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b' }} />
            <Typography variant="caption" color="text.secondary">
              {format(new Date(review.created_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
            </Typography>
          </Box>
        </Box>
      </Box>

      {review.content && (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {review.content}
        </Typography>
      )}

      {review.detailed_ratings && Object.keys(review.detailed_ratings).length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, p: 1.5, bgcolor: '#f8fafc', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, width: '100%', mb: 0.5 }}>
            Đánh giá chi tiết:
          </Typography>
          {review.detailed_ratings.response_time && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption">Thời gian: </Typography>
              <Rating value={review.detailed_ratings.response_time} readOnly size="small" />
            </Box>
          )}
          {review.detailed_ratings.service_quality && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption">Chất lượng: </Typography>
              <Rating value={review.detailed_ratings.service_quality} readOnly size="small" />
            </Box>
          )}
          {review.detailed_ratings.staff_attitude && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption">Thái độ: </Typography>
              <Rating value={review.detailed_ratings.staff_attitude} readOnly size="small" />
            </Box>
          )}
          {review.detailed_ratings.pricing && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption">Giá cả: </Typography>
              <Rating value={review.detailed_ratings.pricing} readOnly size="small" />
            </Box>
          )}
        </Box>
      )}

      <Divider sx={{ my: 1.5 }} />

      {review.reply ? (
        <Box sx={{ pl: 2, borderLeft: `3px solid ${review.reply.is_visible === false ? '#ef4444' : '#10b981'}` }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: review.reply.is_visible === false ? '#991b1b' : '#166534', fontWeight: 600 }}
            >
              Phản hồi của bạn
            </Typography>
            {review.reply.is_visible === false && (
              <Box
                sx={{
                  display: 'inline-flex',
                  bgcolor: '#fef2f2',
                  color: '#dc2626',
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                Đã bị gỡ bởi Admin
              </Box>
            )}
          </Box>
          <Typography
            variant="body2"
            sx={{ color: review.reply.is_visible === false ? '#991b1b' : '#334155', mb: 0.5 }}
          >
            {review.reply.content}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {format(new Date(review.reply.replied_at), 'dd/MM/yyyy HH:mm', { locale: vi })}
          </Typography>
        </Box>
      ) : (
        <Box>
          {!isReplying ? (
            <Button size="small" onClick={() => setIsReplying(true)} sx={{ borderRadius: 2 }}>
              Trả lời đánh giá
            </Button>
          ) : (
            <CompanyReplyForm
              content={replyContent}
              onContentChange={setReplyContent}
              onSubmit={handleReplySubmit}
              onCancel={() => {
                setIsReplying(false);
                setReplyContent('');
              }}
              isSubmitting={isSubmitting}
            />
          )}
        </Box>
      )}
    </Box>
  );
};
