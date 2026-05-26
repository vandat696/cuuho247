import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { CompanyResult, RescueFormData } from '@/types/rescue.type';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import AssignmentIcon from '@mui/icons-material/Assignment';
import StarIcon from '@mui/icons-material/Star';

export default function CompanyDetailsPage() {
  const navigate = useNavigate();
  const locationState = useLocation().state as { formData: RescueFormData; company: CompanyResult } | null;

  if (!locationState) {
    return (
      <MobileLayout>
        <AppHeader title="Chi tiết công ty" onBack={() => navigate('/rescue/search')} />
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

  const formatPrice = (price: number | null) => (price === null ? null : new Intl.NumberFormat('vi-VN').format(price));
  const priceText =
    company.min_price !== null && company.max_price !== null
      ? `${formatPrice(company.min_price)} - ${formatPrice(company.max_price)}đ`
      : 'Chưa cập nhật giá';
  const etaText = company.eta_minutes ? `~${company.eta_minutes} phút` : 'Chưa có ETA';

  const handleNext = () => {
    navigate('/rescue/confirm', {
      state: { formData, company },
    });
  };

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết công ty" onBack={() => navigate(-1)} />

      <Box
        component="main"
        sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {/* Header Hero */}
        <Box sx={{ bgcolor: '#1e3a8a', color: 'white', borderRadius: '12px', p: 2.5 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, fontSize: 20 }}>
            {company.company_name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <StarIcon sx={{ color: '#fbbf24', fontSize: 18, mr: 0.5 }} />
            <Typography sx={{ fontWeight: 700, mr: 1 }}>{company.rating_avg}</Typography>
            <Typography sx={{ color: '#93c5fd', fontSize: 14 }}>({company.rating_count} đánh giá)</Typography>
          </Box>
          <Typography sx={{ color: '#bfdbfe', fontSize: 13, textDecoration: 'underline', cursor: 'pointer' }}>
            Xem tất cả đánh giá
          </Typography>
        </Box>

        {/* Company Info */}
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2 }}>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a', mb: 2 }}>
            Thông tin công ty
          </Typography>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <PersonIcon sx={{ color: '#64748b', fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: 12, color: '#64748b' }}>Giám đốc</Typography>
              <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{company.director_name}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <PhoneIcon sx={{ color: '#64748b', fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: 12, color: '#64748b' }}>Số điện thoại</Typography>
              <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{company.phone}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
            <EmailIcon sx={{ color: '#64748b', fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: 12, color: '#64748b' }}>Email</Typography>
              <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{company.email}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <LocationOnIcon sx={{ color: '#64748b', fontSize: 20 }} />
            <Box>
              <Typography sx={{ fontSize: 12, color: '#64748b' }}>Địa chỉ</Typography>
              <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>
                {company.address.detail ? `${company.address.detail}, ` : ''}
                {company.address.ward ? `${company.address.ward}, ` : ''}
                {company.address.district ? `${company.address.district}, ` : ''}
                {company.address.province}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Service Info Overview */}
        <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2 }}>
          <Typography variant="h6" sx={{ fontSize: 16, fontWeight: 700, color: '#0f172a', mb: 2 }}>
            Thông tin dịch vụ
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
              <PaidIcon sx={{ fontSize: 18, mr: 1 }} />
              <Typography sx={{ fontSize: 14 }}>Giá dự kiến</Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{priceText}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
              <AccessTimeIcon sx={{ fontSize: 18, mr: 1 }} />
              <Typography sx={{ fontSize: 14 }}>Thời gian đến</Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, color: '#ea580c' }}>{etaText}</Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: '#64748b' }}>
              <LocationOnIcon sx={{ fontSize: 18, mr: 1 }} />
              <Typography sx={{ fontSize: 14 }}>Khoảng cách</Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, color: '#1e293b' }}>{company.distance_km} km</Typography>
          </Box>
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
    </MobileLayout>
  );
}
