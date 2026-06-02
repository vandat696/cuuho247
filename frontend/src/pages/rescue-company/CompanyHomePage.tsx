import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Box, IconButton, Typography } from '@mui/material';
import {
  ApartmentOutlined as ApartmentIcon,
  DescriptionOutlined as ServicesIcon,
  LocalShippingOutlined as VehiclesIcon,
  LogoutRounded as LogoutIcon,
  NotificationsNoneRounded as NotificationsIcon,
} from '@mui/icons-material';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Company } from '@/types/common.type';
import { PendingRescueRequest } from '@/types/rescue.type';
import { companyService } from '@/services/company.service';
import { rescueService } from '@/services/rescueRequestCompany.service';
import { toast } from 'react-hot-toast';

const NAVY = '#1B3A5D';
const ORANGE = '#FF6B00';
const CARD_RADIUS = '12px';
const CIRCLE_RADIUS = '9999px';
const NOTIFICATION_POLL_MS = 15000;

const StatCard = ({
  value,
  label,
  color,
  hoverColor,
  onClick,
}: {
  value: number | string;
  label: string;
  color: string;
  hoverColor: string;
  onClick?: () => void;
}) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
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
      cursor: onClick ? 'pointer' : 'default',
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
  const [counts, setCounts] = useState({ waiting: 0, inProgress: 3, done: 12, cancelled: 2 });
  const [company, setCompany] = useState<Company | null>(null);
  const [pendingRequests, setPendingRequests] = useState<PendingRescueRequest[]>([]);
  const knownPendingIdsRef = useRef<Set<string>>(new Set());
  const hasInitializedNotificationsRef = useRef(false);

  useEffect(() => {
    fetchCompanyProfile();
    fetchActiveRequestsCount();
    fetchCompletedRequestsCount();
    fetchCanceledRequestsCount();
    fetchPendingRequests({ notifyNew: false });

    const intervalId = window.setInterval(() => {
      fetchPendingRequests({ notifyNew: true });
    }, NOTIFICATION_POLL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const response = await companyService.getProfile();
      if (response.status === 'success') {
        setCompany(response.data);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast.error('Không thể tải thông tin công ty');
    }
  };

  const fetchPendingRequests = async ({ notifyNew }: { notifyNew: boolean }) => {
    try {
      const response = await rescueService.getCompanyPendingRequests();
      if (response.status !== 'success') return;

      const requests = response.data.requests;
      setPendingRequests(requests);
      setCounts((prev) => ({ ...prev, waiting: response.data.total }));

      const nextIds = new Set(requests.map((request) => request._id));

      if (!hasInitializedNotificationsRef.current) {
        knownPendingIdsRef.current = nextIds;
        hasInitializedNotificationsRef.current = true;
        return;
      }

      const newRequests = requests.filter((request) => !knownPendingIdsRef.current.has(request._id));
      knownPendingIdsRef.current = nextIds;

      if (notifyNew && newRequests.length > 0) {
        const firstRequest = newRequests[0];
        toast.success(
          newRequests.length === 1
            ? `Có yêu cầu cứu hộ mới: ${firstRequest.title}`
            : `Có ${newRequests.length} yêu cầu cứu hộ mới`,
          { duration: 5000 }
        );
      }
    } catch (error) {
      console.error('Error fetching pending rescue notifications:', error);
    }
  };

  const fetchActiveRequestsCount = async () => {
    try {
      const response = await rescueService.getCompanyActiveRequests();
      if (response.status === 'success') {
        setCounts((prev) => ({ ...prev, inProgress: response.data.total }));
      }
    } catch (error) {
      console.error('Error fetching active rescue count:', error);
    }
  };

  const fetchCompletedRequestsCount = async () => {
    try {
      const response = await rescueService.getCompanyCompletedRequests();
      if (response.status === 'success') {
        setCounts((prev) => ({ ...prev, done: response.data.total }));
      }
    } catch (error) {
      console.error('Error fetching completed rescue count:', error);
    }
  };

  const fetchCanceledRequestsCount = async () => {
    try {
      const response = await rescueService.getCompanyCanceledRequests();
      if (response.status === 'success') {
        setCounts((prev) => ({ ...prev, cancelled: response.data.total }));
      }
    } catch (error) {
      console.error('Error fetching canceled rescue count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('accountId');
    localStorage.removeItem('accountPhone');
    localStorage.removeItem('accountName');
    localStorage.removeItem('companyId');
    localStorage.removeItem('companyReadNotificationIds');
    toast.success('Đăng xuất thành công');
    navigate('/login', { replace: true });
  };

  const companyName = company?.company_name || 'Cứu hộ Minh Anh';

  return (
    <MobileLayout>
      <AppHeader
        title="Cứu hộ 247"
        showBack={false}
        rightSlot={
          <IconButton
            aria-label="Thông báo yêu cầu cứu hộ"
            size="small"
            onClick={() => navigate('/company/notifications')}
            sx={{ p: 1, color: '#fff' }}
          >
            <Badge
              badgeContent={pendingRequests.length}
              color="error"
              overlap="circular"
              sx={{
                '& .MuiBadge-badge': {
                  minWidth: 16,
                  height: 16,
                  fontSize: 10,
                  fontWeight: 700,
                },
              }}
            >
              <NotificationsIcon sx={{ fontSize: 24 }} />
            </Badge>
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
          <StatCard
            value={counts.waiting}
            label="Đang chờ"
            color={ORANGE}
            hoverColor={ORANGE}
            onClick={() => navigate('/company/rescue/pending')}
          />
          <StatCard
            value={counts.inProgress}
            label="Đang thực hiện"
            color={NAVY}
            hoverColor={NAVY}
            onClick={() => navigate('/company/rescue/active')}
          />
          <StatCard
            value={counts.done}
            label="Hoàn thành"
            color="#16a34a"
            hoverColor="#16a34a"
            onClick={() => navigate('/company/rescue/completed')}
          />
          <StatCard
            value={counts.cancelled}
            label="Đã hủy"
            color="#dc2626"
            hoverColor="#dc2626"
            onClick={() => navigate('/company/rescue/canceled')}
          />
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

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e5e7eb' }}>
          <Box
            component="button"
            type="button"
            onClick={handleLogout}
            sx={{
              width: '100%',
              p: 2,
              border: '2px solid #fee2e2',
              borderRadius: CARD_RADIUS,
              bgcolor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: '#dc2626',
              fontSize: 16,
              fontWeight: 700,
              transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
              '&:hover': { bgcolor: '#fff5f5', borderColor: '#fecaca' },
              '&:active': { transform: 'scale(0.99)' },
            }}
          >
            <LogoutIcon sx={{ fontSize: 22 }} />
            Đăng xuất
          </Box>
        </Box>
      </Box>
    </MobileLayout>
  );
}
