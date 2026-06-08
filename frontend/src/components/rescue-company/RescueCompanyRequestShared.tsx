import { ReactNode } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { LocalShippingOutlined as TruckIcon } from '@mui/icons-material';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { NAVY, ORANGE, GREEN, RED, CARD_RADIUS, BUTTON_RADIUS } from '@/constants/colors';

export { NAVY, ORANGE, GREEN, RED, CARD_RADIUS, BUTTON_RADIUS };

export const formatAddress = (address?: Record<string, unknown>) => {
  if (!address) return 'Chưa có địa chỉ';

  const parts = ['detail', 'ward', 'district', 'province']
    .map((key) => address[key])
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);

  return parts.length > 0 ? parts.join(', ') : 'Chưa có địa chỉ';
};

export const formatDistance = (distanceKm: number | null) => {
  if (distanceKm === null || Number.isNaN(distanceKm)) return '-- km';
  return `${distanceKm.toFixed(1)} km`;
};

export const formatDateTime = (dateValue?: string) => {
  if (!dateValue) return 'Chưa có thời gian';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Chưa có thời gian';

  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())} - ${pad(date.getDate())}/${pad(
    date.getMonth() + 1
  )}/${date.getFullYear()}`;
};

export const formatTimeOnly = (dateValue?: string) => {
  if (!dateValue) return 'Chưa có thời gian';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Chưa có thời gian';

  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatTimeAgo = (dateValue?: string) => {
  if (!dateValue) return 'Vừa xong';

  const createdAt = new Date(dateValue).getTime();
  const diffMinutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000));

  if (diffMinutes < 1) return 'Vừa xong';
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  return `${Math.floor(diffHours / 24)} ngày trước`;
};

export const formatCurrency = (amount?: number) => {
  if (typeof amount !== 'number') return 'Chưa có số tiền';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const paymentMethodLabel: Record<string, string> = {
  cash: 'Tiền mặt',
  bank_transfer: 'Chuyển khoản',
  e_wallet: 'Ví điện tử',
};

export interface InfoRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export const InfoCard = ({ title, children }: { title: string; children: ReactNode }) => (
  <Box
    sx={{
      p: 2,
      mb: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
    }}
  >
    <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>{title}</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>{children}</Box>
  </Box>
);

export const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
    <Box sx={{ mt: 0.25, color: NAVY, display: 'flex', '& svg': { fontSize: 20 } }}>{icon}</Box>
    <Box sx={{ minWidth: 0 }}>
      <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{label}</Typography>
      <Box sx={{ mt: 0.25, fontSize: 16, fontWeight: 500, lineHeight: 1.35, color: '#111827' }}>{value}</Box>
    </Box>
  </Box>
);

export const MetaRow = ({ icon, value }: { icon: ReactNode; value: ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
    <Box sx={{ mt: 0.25, color: '#4b5563', display: 'flex', '& svg': { fontSize: 16 } }}>{icon}</Box>
    <Typography sx={{ minWidth: 0, fontSize: 14, color: '#374151', lineHeight: 1.35 }}>{value}</Typography>
  </Box>
);

export const CardContainer = ({ children }: { children: ReactNode }) => (
  <Box
    sx={{
      p: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
    }}
  >
    {children}
  </Box>
);

export const PrimaryActionButton = ({
  children,
  onClick,
  disabled,
  variant = 'navy',
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'navy' | 'orange' | 'outline';
}) => {
  const isOutline = variant === 'outline';
  const background = variant === 'orange' ? ORANGE : NAVY;

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      sx={{
        width: '100%',
        px: 3,
        py: 1.5,
        borderRadius: BUTTON_RADIUS,
        bgcolor: isOutline ? '#fff' : background,
        color: isOutline ? NAVY : '#fff',
        border: isOutline ? `2px solid ${NAVY}` : 0,
        fontSize: 16,
        fontWeight: 500,
        lineHeight: 1.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.75 : 1,
        boxShadow: variant === 'orange' ? '0 10px 15px -3px rgba(255, 107, 0, 0.25)' : 'none',
        transition: 'background 0.15s, transform 0.1s',
        '&:hover': { bgcolor: isOutline ? '#f9fafb' : variant === 'orange' ? '#ff8533' : '#2a5082' },
        '&:active': { transform: 'scale(0.99)' },
      }}
    >
      {children}
    </Box>
  );
};

export const StatusBanner = ({ label, color, background }: { label: string; color: string; background: string }) => (
  <Box
    sx={{
      p: 2,
      mb: 2,
      border: `2px solid ${color}`,
      borderRadius: CARD_RADIUS,
      bgcolor: background,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '9999px', bgcolor: color }} />
      <Typography sx={{ fontSize: 16, fontWeight: 500, color, lineHeight: 1.25 }}>{label}</Typography>
    </Box>
  </Box>
);

export const VehiclePanel = ({ vehicle }: { vehicle: { vehicle_type: string; plate_number: string } }) => (
  <Box
    sx={{
      p: 2,
      mb: 2,
      borderRadius: CARD_RADIUS,
      background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
      color: '#fff',
    }}
  >
    <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, lineHeight: 1.25, color: '#fff' }}>
      Thông tin xe
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TruckIcon sx={{ fontSize: 20, color: '#fff' }} />
        <Typography sx={{ fontSize: 14, lineHeight: 1.3, color: '#fff' }}>{vehicle.vehicle_type}</Typography>
      </Box>
      <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: '#fff' }}>
        {vehicle.plate_number}
      </Typography>
    </Box>
  </Box>
);

export const DetailContentState = ({
  loading,
  missingMessage,
  hasData,
  children,
}: {
  loading: boolean;
  missingMessage: string;
  hasData: boolean;
  children: ReactNode;
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!hasData) {
    return (
      <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
        <Typography sx={{ fontSize: 14 }}>{missingMessage}</Typography>
      </Box>
    );
  }

  return <>{children}</>;
};

export const RescueListScaffold = <T extends { _id: string }>({
  title,
  totalLabel,
  emptyMessage,
  loading,
  requests,
  renderRequest,
}: {
  title: string;
  totalLabel: string;
  emptyMessage: string;
  loading: boolean;
  requests: T[];
  renderRequest: (request: T) => ReactNode;
}) => (
  <MobileLayout>
    <AppHeader title={title} backFallback="/company/home" />

    <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
      <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>
        Tổng số: {requests.length} {totalLabel}
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
          <Typography sx={{ fontSize: 14 }}>{emptyMessage}</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>{requests.map(renderRequest)}</Box>
      )}
    </Box>
  </MobileLayout>
);
