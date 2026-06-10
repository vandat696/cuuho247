import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Dialog, DialogTitle, DialogContent, CircularProgress, Avatar, Rating, IconButton } from '@mui/material';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { InfoField } from '@/components/common/InfoField';
import { CompanyResult, RescueFormData } from '@/types/rescue.type';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';
import CloseIcon from '@mui/icons-material/Close';
import { formatPriceRange, formatEta } from '@/utils/format';
import { reviewService } from '@/services/review.service';
import { toast } from 'react-hot-toast';

export default function CompanyDetailsPage() {
  const navigate = useNavigate();
  const locationState = useLocation().state as { formData: RescueFormData; company: CompanyResult } | null;

  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  if (!locationState) {
    return (
      <MobileLayout>
        <AppHeader title="Chi tiết công ty" backFallback="/rescue/request" />
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography>Không tìm thấy dữ liệu.</Typography>
          <Button variant="primary" onClick={() => navigate('/rescue/request')} sx={{ mt: 2 }}>
            Quay lại tìm kiếm
          </Button>
        </Box>
      </MobileLayout>
    );
  }

  const { formData, company } = locationState;

  const priceText = formatPriceRange(company.min_price, company.max_price);
  const etaText = formatEta(company.eta_minutes);

  const addressText = [company.address.detail, company.address.ward, company.address.district, company.address.province]
    .filter(Boolean)
    .join(', ');

  const handleNext = () => {
    navigate('/rescue/confirm', { state: { formData, company } });
  };

  const handleOpenReviews = async () => {
    setIsReviewsModalOpen(true);
    if (reviews.length === 0) {
      setLoadingReviews(true);
      try {
        const res = await reviewService.getCompanyReviews(company._id, 1, 20);
        setReviews(res.data.reviews || []);
      } catch (error) {
        toast.error('Lỗi khi tải danh sách đánh giá');
      } finally {
        setLoadingReviews(false);
      }
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết công ty" backFallback="/rescue/request" />

      <Box
        component="main"
        sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {/* Header Hero */}
        <Box sx={{ bgcolor: '#1e3a8a', color: '#ffffff', borderRadius: '12px', p: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: 20, color: '#ffffff' }}>
            {company.company_name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StarIcon sx={{ color: '#fbbf24', fontSize: 18, mr: 0.5 }} />
            {company.rating_count > 0 ? (
              <>
                <Typography sx={{ fontWeight: 700, mr: 1, color: '#ffffff' }}>{company.rating_avg}</Typography>
                <Typography sx={{ color: '#93c5fd', fontSize: 14 }}>({company.rating_count} đánh giá)</Typography>
              </>
            ) : (
              <Typography sx={{ color: '#93c5fd', fontSize: 14 }}>Chưa có đánh giá</Typography>
            )}
          </Box>
          <Typography
            onClick={handleOpenReviews}
            sx={{ color: '#bfdbfe', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}
          >
            Xem tất cả đánh giá
          </Typography>
        </Box>

        {/* Company Info */}
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2 }}>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a', mb: 2 }}>
            Thông tin công ty
          </Typography>
          <InfoField icon={<PersonIcon sx={{ fontSize: 20 }} />} label="Giám đốc" value={company.director_name} />
          <InfoField icon={<PhoneIcon sx={{ fontSize: 20 }} />} label="Số điện thoại" value={company.phone} />
          <InfoField icon={<EmailIcon sx={{ fontSize: 20 }} />} label="Email" value={company.email} />
          <InfoField icon={<LocationOnIcon sx={{ fontSize: 20 }} />} label="Địa chỉ" value={addressText} />
        </Box>

        {/* Service Info Overview */}
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2 }}>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a', mb: 2 }}>
            Thông tin dịch vụ
          </Typography>
          <InfoField icon={<PaidIcon sx={{ fontSize: 20 }} />} label="Giá dự kiến" value={priceText} />
          <InfoField icon={<AccessTimeIcon sx={{ fontSize: 20 }} />} label="Thời gian đến" value={etaText} />
          <InfoField
            icon={<LocationOnIcon sx={{ fontSize: 20 }} />}
            label="Khoảng cách"
            value={`${company.distance_km} km`}
          />
        </Box>

        {/* Provided Services */}
        <Box sx={{ bgcolor: '#f0f9ff', borderRadius: '12px', p: 2, border: '1px solid #bae6fd' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, color: '#0f172a' }}>
            <AssignmentIcon sx={{ fontSize: 18, mr: 1, color: '#ea580c' }} />
            <Typography sx={{ fontWeight: 700 }}>Dịch vụ cung cấp</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pl: 1 }}>
            {company.service_names && company.service_names.length > 0 ? (
              company.service_names.map((svc, idx) => (
                <Typography key={idx} sx={{ fontSize: 14, color: '#334155', display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: 6, fontSize: 18, color: '#64748b' }}>•</span> {svc}
                </Typography>
              ))
            ) : (
              <Typography sx={{ fontSize: 14, color: '#64748b' }}>Chưa cập nhật chi tiết</Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ mt: 2, mb: 4 }}>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            onClick={handleNext}
            sx={{ height: 52, fontSize: 16, borderRadius: '12px' }}
          >
            Gửi yêu cầu cứu hộ
          </Button>
        </Box>
      </Box>

      {/* Reviews Modal */}
      <Dialog
        open={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, maxHeight: '80vh' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Đánh giá công ty
          <IconButton onClick={() => setIsReviewsModalOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loadingReviews ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : reviews.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>Chưa có đánh giá nào.</Typography>
          ) : (
            reviews.map((review: any) => (
              <Box
                key={review._id}
                sx={{
                  mb: 3,
                  pb: 3,
                  borderBottom: '1px solid #f1f5f9',
                  '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 },
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                  <Avatar src={review.user_id?.avatar_url} sx={{ width: 36, height: 36 }} />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {review.user_id?.full_name || 'Khách hàng'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b' }} />
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString('vi-VN')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                {review.content && (
                  <Typography variant="body2" sx={{ ml: 6 }}>
                    {review.content}
                  </Typography>
                )}
                {review.reply && (
                  <Box
                    sx={{
                      ml: 6,
                      mt: 1.5,
                      p: 1.5,
                      bgcolor: review.reply.is_visible === false ? '#f8fafc' : '#f0fdf4',
                      borderRadius: 2,
                    }}
                  >
                    {review.reply.is_visible === false ? (
                      <Typography variant="body2" sx={{ color: '#64748b', fontStyle: 'italic' }}>
                        Phản hồi đã bị gỡ bởi quản trị viên.
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>
                          Phản hồi từ công ty
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#14532d', mt: 0.5 }}>
                          {review.reply.content}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Box>
            ))
          )}
        </DialogContent>
      </Dialog>
    </MobileLayout>
  );
}
