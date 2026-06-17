import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Box, IconButton, CircularProgress } from '@mui/material';
import {
  ApartmentOutlined as ApartmentIcon,
  DescriptionOutlined as ServicesIcon,
  LocalShippingOutlined as VehiclesIcon,
  LogoutRounded as LogoutIcon,
  NotificationsNoneRounded as NotificationsIcon,
  StarOutlineRounded as StarOutlineIcon,
  PeopleOutlined as CommunityIcon,
} from '@mui/icons-material';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { StatCard } from '@/components/rescue-company/StatCard';
import { ActionCard } from '@/components/rescue-company/ActionCard';
import { CompanyHeroCard } from '@/components/rescue-company/CompanyHeroCard';
import { CompanyPendingStatus } from '@/components/rescue-company/CompanyPendingStatus';
import { Company } from '@/types/common.type';
import { companyService } from '@/services/company.service';
import { companyRescueService } from '@/services/company-rescue.service';
import { notificationService } from '@/services/notification.service';
import { toast } from 'react-hot-toast';
import { NAVY, ORANGE, CARD_RADIUS } from '@/constants/colors';
import { getSocket } from '@/utils/socket';
import { authService } from '@/services/auth.service';
import { useLogout } from '@/hooks/useLogout';

export default function CompanyHomePage() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ waiting: 0, inProgress: 0, done: 0, cancelled: 0 });
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const knownPendingIdsRef = useRef<Set<string>>(new Set());
  const hasInitializedNotificationsRef = useRef(false);
  const companyStatusRef = useRef<string | null>(null);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getMyNotifications();
      if (response.status === 'success') {
        const count = response.data.notifications.filter((n) => !n.is_read).length;
        setUnreadNotificationsCount(count);
      }
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  useEffect(() => {
    const socket = getSocket();

    const handleNewRescueRequest = () => {
      fetchPendingRequests({ notifyNew: true });
    };

    const handleCompanyStatusChanged = async () => {
      const isActiveNow = await fetchCompanyProfile();
      if (isActiveNow) {
        await Promise.all([
          fetchActiveRequestsCount(),
          fetchCompletedRequestsCount(),
          fetchCanceledRequestsCount(),
          fetchPendingRequests({ notifyNew: false }),
        ]);
      }
    };

    const handleNotificationReceived = (e: Event) => {
      const notification = (e as CustomEvent).detail;
      fetchUnreadCount();
      if (notification) {
        if (notification.type === 'request_created') {
          fetchPendingRequests({ notifyNew: false });
        } else if (notification.type === 'request_cancelled') {
          fetchActiveRequestsCount();
          fetchCanceledRequestsCount();
          fetchPendingRequests({ notifyNew: false });
        }
      }
    };

    // Register listeners synchronously to ensure they are captured by the cleanup function
    socket.on('new_rescue_request', handleNewRescueRequest);
    socket.on('company_status_changed', handleCompanyStatusChanged);
    window.addEventListener('notification_received', handleNotificationReceived);

    const initialize = async () => {
      setLoading(true);
      const isActive = await fetchCompanyProfile();

      if (isActive) {
        await Promise.all([
          fetchActiveRequestsCount(),
          fetchCompletedRequestsCount(),
          fetchCanceledRequestsCount(),
          fetchPendingRequests({ notifyNew: false }),
          fetchUnreadCount(),
        ]);
      }

      setLoading(false);
    };

    initialize();

    return () => {
      socket.off('new_rescue_request', handleNewRescueRequest);
      socket.off('company_status_changed', handleCompanyStatusChanged);
      window.removeEventListener('notification_received', handleNotificationReceived);
    };
  }, []);

  const fetchCompanyProfile = async (): Promise<boolean> => {
    try {
      const response = await companyService.getProfile();
      if (response.status === 'success') {
        setCompany(response.data);
        companyStatusRef.current = response.data.status ?? null;
        return response.data.status === 'active';
      }
      return false;
    } catch (error) {
      console.error('Error fetching company profile:', error);
      toast.error('Không thể tải thông tin công ty');
      return false;
    }
  };

  const fetchPendingRequests = async ({ notifyNew }: { notifyNew: boolean }) => {
    try {
      const response = await companyRescueService.getCompanyPendingRequests();
      if (response.status !== 'success') return;

      const requests = response.data.requests;
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
      const response = await companyRescueService.getCompanyActiveRequests();
      if (response.status === 'success') {
        setCounts((prev) => ({ ...prev, inProgress: response.data.total }));
      }
    } catch (error) {
      console.error('Error fetching active rescue count:', error);
    }
  };

  const fetchCompletedRequestsCount = async () => {
    try {
      const response = await companyRescueService.getCompanyCompletedRequests();
      if (response.status === 'success') {
        setCounts((prev) => ({ ...prev, done: response.data.total }));
      }
    } catch (error) {
      console.error('Error fetching completed rescue count:', error);
    }
  };

  const fetchCanceledRequestsCount = async () => {
    try {
      const response = await companyRescueService.getCompanyCanceledRequests();
      if (response.status === 'success') {
        setCounts((prev) => ({ ...prev, cancelled: response.data.total }));
      }
    } catch (error) {
      console.error('Error fetching canceled rescue count:', error);
    }
  };

  const { handleLogout } = useLogout();

  const companyName = company?.company_name || 'Cứu hộ Minh Anh';
  const isCompanyActive = company?.status === 'active';

  return (
    <MobileLayout>
      <AppHeader
        title="Cứu hộ 247"
        showBack={false}
        rightSlot={
          isCompanyActive ? (
            <IconButton
              aria-label="Thông báo yêu cầu cứu hộ"
              size="small"
              onClick={() => navigate('/company/notifications')}
              sx={{ p: 1, color: '#fff' }}
            >
              <Badge
                badgeContent={unreadNotificationsCount}
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
          ) : undefined
        }
      />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : isCompanyActive ? (
          <>
            <CompanyHeroCard companyName={companyName} onClick={() => navigate('/company/profile')} />

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

            <Box sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>Quản lý nhanh</Box>

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
              <ActionCard
                icon={<StarOutlineIcon sx={{ fontSize: 24 }} />}
                title="Đánh giá khách hàng"
                description="Xem và phản hồi đánh giá"
                onClick={() => navigate('/company/reviews')}
              />
              <ActionCard
                icon={<CommunityIcon sx={{ fontSize: 24 }} />}
                title="Cộng đồng"
                description="Chia sẻ và trao đổi cùng cộng đồng"
                onClick={() => navigate('/community')}
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
                  cursor: 'pointer',
                }}
              >
                <LogoutIcon sx={{ fontSize: 22 }} />
                Đăng xuất
              </Box>
            </Box>
          </>
        ) : (
          <CompanyPendingStatus
            company={company}
            handleLogout={handleLogout}
            onEditProfile={() => navigate('/company/profile/edit')}
          />
        )}
      </Box>
    </MobileLayout>
  );
}
