import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import {
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
import { CompanyInfoCard } from '@/components/company/CompanyInfoCard';
import { Company } from '@/types/common.type';
import { toast } from 'react-hot-toast';
import { companyService } from '@/services/company.service';

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
        <CompanyInfoCard company={company} />

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

        <Button
          variant="secondary"
          size="lg"
          fullWidth
          startIcon={<EditIcon />}
          onClick={() => navigate('/company/profile/edit')}
        >
          Chỉnh sửa thông tin
        </Button>
      </Box>
    </MobileLayout>
  );
};

export default CompanyProfilePage;
