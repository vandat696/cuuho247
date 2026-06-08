import { Box, Typography } from '@mui/material';
import {
  AccessTimeOutlined as ClockIcon,
  BuildOutlined as WrenchIcon,
  LocalShippingOutlined as TruckIcon,
  LocationOnOutlined as LocationIcon,
} from '@mui/icons-material';
import {
  CardContainer,
  CARD_RADIUS,
  formatAddress,
  formatDateTime,
  formatDistance,
  formatTimeAgo,
  formatTimeOnly,
  GREEN,
  MetaRow,
  NAVY,
  PrimaryActionButton,
  RED,
  InfoRow,
} from '@/components/rescue-company/RescueCompanyRequestShared';

type RequestStatus = 'pending' | 'active' | 'completed' | 'canceled';

interface UnifiedRequestCardProps {
  request: any;
  status: RequestStatus;
  onViewDetail: () => void;
}

/**
 * Card hiển thị yêu cầu cứu hộ theo từng trạng thái (pending/active/completed/canceled).
 * Dùng trong RescueRequestListPage.
 */
export const UnifiedRequestCard = ({ request, status, onViewDetail }: UnifiedRequestCardProps) => {
  if (status === 'pending') {
    return (
      <CardContainer>
        <Box sx={{ mb: 1.5 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>{request.title}</Typography>
        </Box>

        <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 2, color: '#4b5563' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 14, lineHeight: 1.25 }}>{formatDistance(request.distance_km)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ClockIcon sx={{ fontSize: 16 }} />
            <Typography sx={{ fontSize: 14, lineHeight: 1.25 }}>{formatTimeAgo(request.created_at)}</Typography>
          </Box>
        </Box>

        <PrimaryActionButton onClick={onViewDetail}>Xem chi tiết</PrimaryActionButton>
      </CardContainer>
    );
  }

  if (status === 'active') {
    return (
      <CardContainer>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
            Thông tin cứu hộ
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <InfoRow icon={<WrenchIcon />} label="Loại sự cố" value={request.title} />
            <InfoRow icon={<LocationIcon />} label="Vị trí" value={formatAddress(request.address)} />
            <InfoRow icon={<ClockIcon />} label="Thời gian yêu cầu" value={formatTimeOnly(request.created_at)} />
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            mb: 1.5,
            borderRadius: CARD_RADIUS,
            background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
            color: '#fff',
          }}
        >
          <Typography sx={{ mb: 1, fontSize: 16, fontWeight: 800, lineHeight: 1.25, color: '#fff' }}>
            Thông tin xe
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TruckIcon sx={{ fontSize: 20, color: '#fff' }} />
              <Typography sx={{ fontSize: 14, lineHeight: 1.3, color: '#fff' }}>
                {request.vehicle?.vehicle_type}
              </Typography>
            </Box>
            <Typography sx={{ pl: 3.5, fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: '#fff' }}>
              {request.vehicle?.plate_number}
            </Typography>
          </Box>
        </Box>

        <PrimaryActionButton onClick={onViewDetail}>Xem chi tiết</PrimaryActionButton>
      </CardContainer>
    );
  }

  // Completed or Canceled
  const isCompleted = status === 'completed';
  const statusColor = isCompleted ? GREEN : RED;
  const statusBg = isCompleted ? '#f0fdf4' : '#fef2f2';
  const statusLabel = isCompleted ? 'Hoàn thành' : 'Đã hủy';
  const timeLabel = isCompleted ? request.completed_at : request.cancelled_at;

  return (
    <CardContainer>
      <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ minWidth: 0, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
          {request.title}
        </Typography>
        <Box
          component="span"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: '9999px',
            bgcolor: statusBg,
            color: statusColor,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          {statusLabel}
        </Box>
      </Box>

      <Box sx={{ mb: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <MetaRow icon={<TruckIcon />} value={request.vehicle?.plate_number || ''} />
        <MetaRow icon={<LocationIcon />} value={formatAddress(request.address)} />
        <MetaRow icon={<ClockIcon />} value={formatDateTime(timeLabel || request.created_at)} />
      </Box>

      <PrimaryActionButton onClick={onViewDetail}>Xem chi tiết</PrimaryActionButton>
    </CardContainer>
  );
};
