import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import {
  ApartmentOutlined as ApartmentIcon,
  DescriptionOutlined as DocumentIcon,
  EditOutlined as EditIcon,
  EmailOutlined as EmailIcon,
  LocationOnOutlined as LocationIcon,
  PersonOutlineRounded as PersonIcon,
  PhoneOutlined as PhoneIcon,
} from '@mui/icons-material';
import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Company } from '@/types/common.type';
import { toast } from 'react-hot-toast';
import { companyService } from '@/services/company.service';

const NAVY = '#1B3A5D';
const CARD_RADIUS = '12px';
const BUTTON_RADIUS = '8px';
const CIRCLE_RADIUS = '9999px';

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
    <Box sx={{ mt: 0.25, color: NAVY, flexShrink: 0, display: 'flex' }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{label}</Typography>
      <Typography sx={{ mt: 0.25, fontSize: 16, fontWeight: 500, color: '#111827', lineHeight: 1.35 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

const getAddressText = (company: Company) => {
  const address = company.address;
  if (!address) return '45 Giải Phóng, Hai Bà Trưng, Hà Nội';

  if (typeof address === 'string') return address;

  return (
    address.street ||
    address.detail ||
    [address.ward, address.district, address.province || address.city].filter(Boolean).join(', ') ||
    '45 Giải Phóng, Hai Bà Trưng, Hà Nội'
  );
};

const getServiceArea = (company: Company) => {
  return company.service_area || company.address?.city || company.address?.province || 'Hà Nội';
};

const CompanyProfilePage = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const response = await companyService.getProfile();
      if (response.status === 'success') {
        setCompany(response.data);
      }
    } catch (error) {
      toast.error('Không thể tải thông tin công ty');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          <CircularProgress />
        </Box>
      </MobileLayout>
    );
  }

  if (!company) {
    return (
      <MobileLayout>
        <AppHeader title="Thông tin công ty" onBack={() => navigate(-1)} />
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
          <Typography>Không tìm thấy thông tin công ty</Typography>
        </Box>
      </MobileLayout>
    );
  }

  const companyName = company.company_name || 'Cứu hộ Minh Anh';
  const directorName = company.director_name || 'Trần Minh Anh';
  const email = company.email || 'cuuhominhanh@email.com';
  const phone = company.phone || '024 3456 7890';
  const verifiedText = company.is_verified === false ? 'Chưa xác minh' : 'Đã xác minh ✓';

  return (
    <MobileLayout>
      <AppHeader title="Thông tin công ty" onBack={() => navigate(-1)} />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <Box
          sx={{
            p: 3,
            mb: 3,
            borderRadius: CARD_RADIUS,
            background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              p: 2,
              mb: 1.5,
              borderRadius: CIRCLE_RADIUS,
              bgcolor: 'rgba(255,255,255,0.2)',
            }}
          >
            <ApartmentIcon sx={{ fontSize: 48 }} />
          </Box>
          <Typography sx={{ fontSize: 20, fontWeight: 800, lineHeight: 1.25, color: '#fff' }}>{companyName}</Typography>
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: CIRCLE_RADIUS, bgcolor: '#4ade80' }} />
            <Typography sx={{ fontSize: 14, color: '#fff', lineHeight: 1.25 }}>Đang hoạt động</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            mb: 3,
            border: '2px solid #e5e7eb',
            borderRadius: CARD_RADIUS,
            bgcolor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          }}
        >
          <Typography sx={{ mb: 0.5, fontSize: 16, fontWeight: 800, color: NAVY }}>Thông tin chi tiết</Typography>
          <InfoRow icon={<PersonIcon sx={{ fontSize: 20 }} />} label="Họ và tên giám đốc" value={directorName} />
          <InfoRow icon={<EmailIcon sx={{ fontSize: 20 }} />} label="Email công ty" value={email} />
          <InfoRow icon={<PhoneIcon sx={{ fontSize: 20 }} />} label="Số điện thoại công ty" value={phone} />
          <InfoRow
            icon={<LocationIcon sx={{ fontSize: 20 }} />}
            label="Địa chỉ công ty"
            value={getAddressText(company)}
          />
          <InfoRow
            icon={<LocationIcon sx={{ fontSize: 20 }} />}
            label="Phạm vi hoạt động"
            value={getServiceArea(company)}
          />
          <InfoRow
            icon={<DocumentIcon sx={{ fontSize: 20 }} />}
            label="Giấy phép kinh doanh"
            value={
              <Box component="span" sx={{ color: '#2563eb' }}>
                {verifiedText}
              </Box>
            }
          />
        </Box>

        <Box
          component="button"
          type="button"
          onClick={() => navigate('/company/profile/edit')}
          sx={{
            width: '100%',
            px: 3,
            py: 1.5,
            borderRadius: BUTTON_RADIUS,
            bgcolor: NAVY,
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s, transform 0.1s',
            '&:hover': { bgcolor: '#2a5082' },
            '&:active': { transform: 'scale(0.99)' },
          }}
        >
          <EditIcon sx={{ fontSize: 20, mr: 1 }} />
          Chỉnh sửa thông tin
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default CompanyProfilePage;
