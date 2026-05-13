import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import {
  ApartmentRounded as ApartmentIcon,
  HomeRepairServiceOutlined as ServicesIcon,
  LocalShippingOutlined as VehiclesIcon,
  ChevronRightRounded as ChevronRightIcon,
} from '@mui/icons-material';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Card } from '@/components/common/Card';
import { CompanyInfoCard } from '@/components/company/CompanyInfoCard';
import { Company } from '@/types/common.type';
import { companyService } from '@/services/company.service';
import { toast } from 'react-hot-toast';

const StatCard = ({ value, label, color }: { value: number | string; label: string; color: string }) => (
  <Card variant="shadow" padding="md" sx={{ textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
    <Typography variant="h5" sx={{ fontWeight: 'bold', color }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontWeight: 500 }}>
      {label}
    </Typography>
  </Card>
);

const ActionCard = ({
  icon,
  title,
  description,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <Box
    onClick={onClick}
    sx={{
      display: 'flex',
      alignItems: 'center',
      p: 2.5,
      border: '1.5px solid',
      borderColor: 'grey.300',
      borderRadius: 2,
      bgcolor: 'common.white',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255, 107, 0, 0.04)' },
      '&:active': { transform: 'scale(0.98)' },
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        bgcolor: 'rgba(26, 58, 92, 0.06)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1a3a5c',
        flexShrink: 0,
        mr: 2.5,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1, minWidth: 0 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 0.25 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block' }}>
        {description}
      </Typography>
    </Box>
    <ChevronRightIcon sx={{ color: 'text.disabled' }} />
  </Box>
);

export default function CompanyHomePage() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ waiting: 0, inProgress: 0, done: 0, cancelled: 0 });
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await companyService.getProfile();
      if (response.status === 'success') {
        setCompany(response.data);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast.error('Không thể tải thông tin công ty');
    }

    // TODO: Replace with real statistics API when available
    setCounts({ waiting: 5, inProgress: 3, done: 12, cancelled: 2 });
  };

  const handleProfileClick = () => {
    navigate('/company/profile');
  };

  return (
    <MobileLayout>
      <AppHeader title="Cứu hộ 247" showBack={false} />

      <Box sx={{ flex: 1, bgcolor: 'grey.100', display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
        {company && <CompanyInfoCard company={company} onClick={handleProfileClick} />}

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 1.5 }}>
            Tổng quan
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <StatCard value={counts.waiting} label="Đang chờ" color="#FF7A00" />
            <StatCard value={counts.inProgress} label="Đang thực hiện" color="#1E3A5F" />
            <StatCard value={counts.done} label="Hoàn thành" color="#4caf50" />
            <StatCard value={counts.cancelled} label="Đã hủy" color="#f44336" />
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 1.5 }}>
            Quản lý nhanh
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ActionCard
              icon={<ApartmentIcon fontSize="medium" />}
              title="Thông tin công ty"
              description="Xem và chỉnh sửa thông tin"
              onClick={handleProfileClick}
            />
            <ActionCard
              icon={<ServicesIcon fontSize="medium" />}
              title="Danh mục dịch vụ"
              description="Quản lý dịch vụ cung cấp"
              onClick={() => navigate('/company/services')}
            />
            <ActionCard
              icon={<VehiclesIcon fontSize="medium" />}
              title="Phương tiện cứu hộ"
              description="Quản lý xe cứu hộ"
              onClick={() => navigate('/company/vehicles')}
            />
          </Box>
        </Box>
      </Box>
    </MobileLayout>
  );
}
