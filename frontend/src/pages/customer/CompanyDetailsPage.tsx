import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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
import { formatPriceRange, formatEta } from '@/utils/format';

export default function CompanyDetailsPage() {
  const navigate = useNavigate();
  const locationState = useLocation().state as { formData: RescueFormData; company: CompanyResult } | null;

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
            <Typography sx={{ fontWeight: 700, mr: 1, color: '#ffffff' }}>{company.rating_avg}</Typography>
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
    </MobileLayout>
  );
}
