import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Card,
  CardContent,
  Avatar,
  Rating,
} from '@mui/material';
import { DeleteOutline as DeleteIcon, Restore as RestoreIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/common/Button';
import { adminService } from '@/services/admin.service';
import { formatDateTime } from '@/utils/format';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [removeType, setRemoveType] = useState<'review' | 'reply'>('review');
  const [removeReason, setRemoveReason] = useState('');
  const [removing, setRemoving] = useState(false);

  const limit = 20;

  useEffect(() => {
    fetchReviews();
  }, [page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await adminService.getReviews(limit, page);
      if (res.status === 'success') {
        setReviews(res.data.reviews);
        setTotal(res.data.total);
      }
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRemoveModal = (review: any, type: 'review' | 'reply') => {
    setSelectedReview(review);
    setRemoveType(type);
    setRemoveReason('');
    setRemoveModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!removeReason.trim()) {
      toast.error('Vui lòng nhập lý do gỡ');
      return;
    }

    try {
      setRemoving(true);
      if (removeType === 'review') {
        await adminService.removeReview(selectedReview._id, removeReason);
        toast.success('Gỡ đánh giá thành công');
      } else {
        await adminService.removeReviewReply(selectedReview._id, removeReason);
        toast.success('Gỡ phản hồi thành công');
      }
      setRemoveModalOpen(false);
      fetchReviews(); // Refresh list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi gỡ nội dung');
    } finally {
      setRemoving(false);
    }
  };

  const handleRestore = async (review: any, type: 'review' | 'reply') => {
    try {
      if (type === 'review') {
        await adminService.restoreReview(review._id);
        toast.success('Khôi phục đánh giá thành công');
      } else {
        await adminService.restoreReviewReply(review._id);
        toast.success('Khôi phục phản hồi thành công');
      }
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi khôi phục nội dung');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <MobileLayout>
      <AppHeader title="Kiểm duyệt nội dung" />

      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#f8fafc', p: 2 }}>
        {loading && reviews.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : reviews.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            Không có đánh giá nào trên hệ thống
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.map((review) => (
              <Card key={review._id} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <CardContent sx={{ p: '16px !important' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                      <Avatar src={review.user_id?.avatar_url} sx={{ width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {review.user_id?.full_name || 'Khách hàng'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatDateTime(review.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      {!review.is_visible ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label="Đã gỡ" color="error" size="small" />
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleRestore(review, 'review')}
                            title="Khôi phục đánh giá"
                          >
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenRemoveModal(review, 'review')}
                          title="Gỡ đánh giá"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, mt: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Công ty:
                    </Typography>
                    <Typography variant="body2" color="primary.main">
                      {review.company_id?.company_name || 'Không xác định'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b' }} />
                  </Box>

                  {review.content && (
                    <Box sx={{ bgcolor: '#f1f5f9', p: 1.5, borderRadius: 1, mb: 1, position: 'relative' }}>
                      <Typography variant="body2">{review.content}</Typography>
                    </Box>
                  )}

                  {review.reply?.content && (
                    <Box
                      sx={{
                        ml: 3,
                        mt: 1.5,
                        p: 1.5,
                        bgcolor: review.reply.is_visible === false ? '#fef2f2' : '#f0fdf4',
                        borderRadius: 1,
                        position: 'relative',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="caption"
                          sx={{ color: review.reply.is_visible === false ? '#991b1b' : '#166534', fontWeight: 600 }}
                        >
                          Phản hồi từ công ty:
                        </Typography>
                        {review.reply.is_visible === false && (
                          <Chip label="Đã gỡ" color="error" size="small" sx={{ height: 20, fontSize: '0.65rem' }} />
                        )}
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ color: review.reply.is_visible === false ? '#991b1b' : '#14532d' }}
                      >
                        {review.reply.content}
                      </Typography>
                      {review.reply.is_visible !== false ? (
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleOpenRemoveModal(review, 'reply')}
                          sx={{ position: 'absolute', top: 4, right: 4 }}
                          title="Gỡ phản hồi"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      ) : (
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleRestore(review, 'reply')}
                          sx={{ position: 'absolute', top: 4, right: 4 }}
                          title="Khôi phục phản hồi"
                        >
                          <RestoreIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2, mb: 4 }}>
                <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" />
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Dialog open={removeModalOpen} onClose={() => !removing && setRemoveModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>
          Gỡ {removeType === 'review' ? 'đánh giá' : 'phản hồi'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Nội dung này sẽ không còn hiển thị công khai trên hệ thống. Vui lòng nhập lý do gỡ để lưu log và thông báo
            cho người dùng.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do gỡ nội dung"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={removeReason}
            onChange={(e) => setRemoveReason(e.target.value)}
            disabled={removing}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button variant="outline" onClick={() => setRemoveModalOpen(false)} disabled={removing}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmRemove}
            loading={removing}
            sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
          >
            Xác nhận gỡ
          </Button>
        </DialogActions>
      </Dialog>
    </MobileLayout>
  );
}
