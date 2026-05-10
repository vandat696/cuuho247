import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import {
  ApartmentRounded as ApartmentIcon,
  PersonOutlineRounded as PersonIcon,
  EmailOutlined as EmailIcon,
  PhoneOutlined as PhoneIcon,
  LocationOnOutlined as LocationIcon,
  MyLocationOutlined as ScopeIcon,
  DescriptionOutlined as DocumentIcon,
  EditOutlined as EditIcon,
} from '@mui/icons-material';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Company } from '@/types/common.type';
import { toast } from 'react-hot-toast';

// ---------- InfoRow ----------

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  showDivider?: boolean;
}

const InfoRow = ({ icon, label, value, showDivider = true }: InfoRowProps) => (
  <>
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, py: 1.25 }}>
      <Box sx={{ color: 'text.secondary', mt: 0.25, flexShrink: 0 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.25 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      </Box>
    </Box>
    {showDivider && <Divider />}
  </>
);

// ---------- Page ----------

const CompanyProfilePage = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      // const response = await companyService.getProfile();
      // if (response.status === 'success') {
      //   setCompany(response.data);
      // }
      const mockCompany: Company = {
        _id: '1',
        company_name: 'Cứu Hộ Minh Anh',
        director_name: 'Trần Minh Anh',
        email: 'cuuhominhanh@email.com',
        phone: '024 3456 7890',
        address: {
          street: '45 Giải Phóng, Hai Bà Trưng, Hà Nội',
          city: 'Hà Nội',
        },
        is_verified: true,
        is_active: true,
      };
      setCompany(mockCompany);
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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

  return (
    <MobileLayout>
      <AppHeader title="Thông tin công ty" onBack={() => navigate(-1)} />

      <Box sx={{ flex: 1, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
        <Card
          variant="navy"
          padding="lg"
          sx={{
            background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'rgba(255,255,255,0.15)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <ApartmentIcon sx={{ fontSize: 34, color: 'common.white' }} />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 'bold', lineHeight: 1.2 }}>
                  {company.company_name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  Hồ sơ công ty
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexShrink: 0 }}>
              <Box
                sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: company.is_active ? '#4caf50' : 'grey.400' }}
              />
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                {company.is_active ? 'Đang hoạt động' : 'Ngừng hoạt động'}
              </Typography>
            </Box>
          </Box>
        </Card>

        <Card variant="shadow" padding="md" sx={{ boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 0.5 }}>
            Thông tin chi tiết
          </Typography>

          {company.director_name && (
            <InfoRow icon={<PersonIcon fontSize="small" />} label="Họ và tên giám đốc" value={company.director_name} />
          )}

          <InfoRow icon={<EmailIcon fontSize="small" />} label="Email công ty" value={company.email} />

          <InfoRow icon={<PhoneIcon fontSize="small" />} label="Số điện thoại công ty" value={company.phone} />

          {company.address?.street && (
            <InfoRow icon={<LocationIcon fontSize="small" />} label="Địa chỉ công ty" value={company.address.street} />
          )}

          {company.address?.city && (
            <InfoRow icon={<ScopeIcon fontSize="small" />} label="Phạm vi hoạt động" value={company.address.city} />
          )}

          <InfoRow
            icon={<DocumentIcon fontSize="small" />}
            label="Giấy phép kinh doanh"
            value={
              <Typography
                component="span"
                variant="body2"
                sx={{ fontWeight: 600, color: company.is_verified ? 'primary.main' : 'text.secondary' }}
              >
                {company.is_verified ? 'Đã xác minh ✓' : 'Chưa xác minh'}
              </Typography>
            }
            showDivider={false}
          />
        </Card>

        {/* ── Button: tái sử dụng y nguyên ── */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          startIcon={<EditIcon />}
          onClick={() => navigate('/company/edit')}
        >
          Chỉnh sửa thông tin
        </Button>
      </Box>
    </MobileLayout>
  );
};

export default CompanyProfilePage;
