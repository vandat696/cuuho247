import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import {
  ApartmentOutlined as ApartmentIcon,
  DescriptionOutlined as ServicesIcon,
  LocalShippingOutlined as VehiclesIcon,
  NotificationsNoneRounded as NotificationsIcon,
} from '@mui/icons-material';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Company } from '@/types/common.type';
import { companyService } from '@/services/company.service';
import { toast } from 'react-hot-toast';

const NAVY = '#1B3A5D';
const ORANGE = '#FF6B00';
const CARD_RADIUS = '12px';
const CIRCLE_RADIUS = '9999px';

const StatCard = ({
  value,
  label,
  color,
  hoverColor,
}: {
  value: number | string;
  label: string;
  color: string;
  hoverColor: string;
}) => (
  <Box
    component="button"
    type="button"
    sx={{
      minHeight: 92,
      p: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      transition: 'border-color 0.15s, transform 0.1s',
      '&:hover': { borderColor: hoverColor },
      '&:active': { transform: 'scale(0.99)' },
    }}
  >
    <Typography sx={{ fontSize: 24, lineHeight: 1, fontWeight: 800, color }}>{value}</Typography>
    <Typography sx={{ mt: 1, fontSize: 12, color: '#4b5563', lineHeight: 1.2 }}>{label}</Typography>
  </Box>
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
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      width: '100%',
      p: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      textAlign: 'left',
      color: NAVY,
      transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
      '&:hover': { bgcolor: '#F5F7FA', borderColor: '#e5e7eb' },
      '&:active': { transform: 'scale(0.99)' },
    }}
  >
    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: NAVY, lineHeight: 1.25 }}>{title}</Typography>
      <Typography sx={{ mt: 0.25, fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{description}</Typography>
    </Box>
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

    setCounts({ waiting: 5, inProgress: 3, done: 12, cancelled: 2 });
  };

  const companyName = company?.company_name || 'Cứu hộ Minh Anh';

  return (
    <MobileLayout>
      <AppHeader
        title="Cứu hộ 247"
        showBack={false}
        rightSlot={
          <IconButton aria-label="Thông báo" size="small" sx={{ p: 1, color: '#fff' }}>
            <NotificationsIcon sx={{ fontSize: 24 }} />
          </IconButton>
        }
      />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <Box
          onClick={() => navigate('/company/profile')}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: CARD_RADIUS,
            background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ mb: 0.5, fontSize: 20, fontWeight: 800, lineHeight: 1.25, color: '#fff' }}>
            {companyName}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: CIRCLE_RADIUS, bgcolor: '#4ade80' }} />
            <Typography sx={{ fontSize: 14, color: '#fff', lineHeight: 1.25 }}>Đang hoạt động</Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <StatCard value={counts.waiting} label="Đang chờ" color={ORANGE} hoverColor={ORANGE} />
          <StatCard value={counts.inProgress} label="Đang thực hiện" color={NAVY} hoverColor={NAVY} />
          <StatCard value={counts.done} label="Hoàn thành" color="#16a34a" hoverColor="#16a34a" />
          <StatCard value={counts.cancelled} label="Đã hủy" color="#dc2626" hoverColor="#dc2626" />
        </Box>

        <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>Quản lý nhanh</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <ActionCard
            icon={<ApartmentIcon sx={{ fontSize: 24 }} />}
            title="Thông tin công ty"
            description="Xem và chỉnh sửa thông tin"
            onClick={() => navigate('/company/profile')}
          />
          <ActionCard
            icon={<ServicesIcon sx={{ fontSize: 24 }} />}
            title="Danh mục dịch vụ"
            description="Quản lý dịch vụ cung cấp"
            onClick={() => navigate('/company/services')}
          />
          <ActionCard
            icon={<VehiclesIcon sx={{ fontSize: 24 }} />}
            title="Phương tiện cứu hộ"
            description="Quản lý xe cứu hộ"
            onClick={() => navigate('/company/vehicles')}
          />
        </Box>
      </Box>
    </MobileLayout>
  );
}
