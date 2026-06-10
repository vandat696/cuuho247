import { ReactNode, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  HomeOutlined as HomeIcon,
  BusinessOutlined as CompanyIcon,
  BarChartOutlined as ReportsIcon,
  SpeedOutlined as QualityIcon,
  PeopleAltOutlined as UsersIcon,
  RateReviewOutlined as ReviewsIcon,
  HistoryOutlined as LogsIcon,
  LogoutOutlined as LogoutIcon,
  ArrowBackOutlined as ArrowBackIcon,
  AdminPanelSettingsOutlined as AdminIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import { adminService } from '@/services/admin.service';
import { NAVY, ORANGE, CARD_RADIUS } from '@/constants/colors';
import { DesktopLayout } from './DesktopLayout';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  backFallback?: string;
}

export function AdminLayout({
  children,
  title,
  showBack = false,
  onBack,
  backFallback = '/admin/home',
}: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    fetchPendingCount();
    // Set periodic polling for pending company requests (every 60s)
    const interval = setInterval(fetchPendingCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchPendingCount = async () => {
    try {
      const response = await adminService.getPendingCompanies();
      if (response.status === 'success') {
        setPendingCount(response.data.length);
      }
    } catch (error) {
      console.error('Error fetching pending companies in layout:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    localStorage.removeItem('accountId');
    localStorage.removeItem('accountPhone');
    localStorage.removeItem('accountName');
    localStorage.removeItem('companyId');
    toast.success('Đăng xuất thành công');
    navigate('/login', { replace: true });
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(backFallback, { replace: true });
    }
  };

  const adminName = localStorage.getItem('accountName') || 'Quản trị viên';
  const adminEmail = localStorage.getItem('accountEmail') || 'admin@cuuho247.vn';

  const menuItems = [
    { text: 'Tổng quan', path: '/admin/home', icon: <HomeIcon /> },
    {
      text: 'Công ty cứu hộ chờ duyệt',
      path: '/admin/companies/pending',
      icon: <CompanyIcon />,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    { text: 'Báo cáo hoạt động', path: '/admin/reports', icon: <ReportsIcon /> },
    { text: 'Chất lượng dịch vụ', path: '/admin/reports/service-quality', icon: <QualityIcon /> },
    { text: 'Danh sách tài khoản', path: '/admin/users', icon: <UsersIcon /> },
    { text: 'Quản lý đánh giá', path: '/admin/reviews', icon: <ReviewsIcon /> },
    { text: 'Nhật ký hệ thống', path: '/admin/logs', icon: <LogsIcon /> },
  ];

  return (
    <DesktopLayout>
      {/* 1. Sidebar */}
      <Box
        sx={{
          width: 280,
          bgcolor: NAVY,
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          flexShrink: 0,
        }}
      >
        {/* Brand Header */}
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <Typography
            sx={{ fontSize: 22, fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}
          >
            Cứu hộ 247
          </Typography>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              color: ORANGE,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              mt: 0.5,
            }}
          >
            Admin Portal
          </Typography>
        </Box>

        {/* Menu Navigation */}
        <Box sx={{ flex: 1, overflowY: 'auto', py: 2, px: 1.5 }}>
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {menuItems.map((item) => {
              const isActive =
                item.path === '/admin/reports'
                  ? location.pathname === '/admin/reports'
                  : item.path === '/admin/home'
                    ? location.pathname === '/admin/home'
                    : location.pathname.startsWith(item.path);

              return (
                <ListItemButton
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: CARD_RADIUS,
                    py: 1.25,
                    px: 2,
                    bgcolor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    borderLeft: isActive ? `4px solid ${ORANGE}` : '4px solid transparent',
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.7)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      color: '#fff',
                    },
                    transition: 'all 0.15s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? ORANGE : 'rgba(255, 255, 255, 0.6)',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 500,
                      color: 'inherit',
                    }}
                  />
                  {item.badge !== undefined && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 20,
                        height: 20,
                        borderRadius: '10px',
                        bgcolor: ORANGE,
                        color: '#fff',
                        px: 0.75,
                        ml: 1.5,
                        fontSize: 11,
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </ListItemButton>
              );
            })}
          </List>
        </Box>

        {/* Sidebar Footer */}
        <Box
          sx={{
            p: 2.5,
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {/* User info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '50%',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AdminIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }} noWrap>
                {adminName}
              </Typography>
              <Typography sx={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.5)', mt: 0.25 }} noWrap>
                {adminEmail}
              </Typography>
            </Box>
          </Box>

          {/* Logout button */}
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: CARD_RADIUS,
              py: 1,
              px: 1.5,
              color: '#f87171',
              bgcolor: 'rgba(248, 113, 113, 0.05)',
              '&:hover': {
                bgcolor: 'rgba(248, 113, 113, 0.15)',
                color: '#ef4444',
              },
              transition: 'all 0.15s',
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 32 }}>
              <LogoutIcon sx={{ fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="Đăng xuất"
              primaryTypographyProps={{
                fontSize: 13,
                fontWeight: 700,
                color: 'inherit',
              }}
            />
          </ListItemButton>
        </Box>
      </Box>

      {/* 2. Main Content Viewport */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header Bar */}
        <Box
          sx={{
            height: 64,
            bgcolor: '#fff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            flexShrink: 0,
          }}
        >
          {/* Left Title & Back button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {showBack && (
              <ListItemButton
                onClick={handleBack}
                sx={{
                  width: 36,
                  height: 36,
                  p: 0,
                  borderRadius: '50%',
                  bgcolor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': { bgcolor: '#e2e8f0' },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 18, color: NAVY }} />
              </ListItemButton>
            )}
            <Typography sx={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{title}</Typography>
          </Box>

          {/* Right Role / Date Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                px: 1.5,
                py: 0.5,
                borderRadius: '6px',
                bgcolor: 'rgba(27, 58, 93, 0.05)',
                color: NAVY,
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}
            >
              Hệ thống quản trị
            </Box>
          </Box>
        </Box>

        {/* Content view scroll area */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {children}
        </Box>
      </Box>
    </DesktopLayout>
  );
}
