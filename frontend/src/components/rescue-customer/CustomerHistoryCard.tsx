import { Box, Typography } from '@mui/material';
import { AccessTimeOutlined, SecurityOutlined } from '@mui/icons-material';
import { CancelButton } from '@/components/rescue-customer/CancelButton';
import { CustomerRescueRequest, CustomerRescueRequestStatus } from '@/services/customer-rescue.service';
import { NAVY, ORANGE, CARD_RADIUS } from '@/constants/colors';
import { formatDateTime } from '@/utils/format';

const statusTextByValue: Record<CustomerRescueRequestStatus, string> = {
  pending: 'Đang chờ công ty xác nhận',
  accepted: 'Công ty đã nhận yêu cầu',
  in_progress: 'Đội cứu hộ đang di chuyển',
  arrived: 'Xe đã đến nơi',
  completed: 'Đã hoàn thành',
  cancelled: 'Đã hủy',
  rejected: 'Bị từ chối',
  timeout: 'Hết thời gian phản hồi',
};

const cancellableStatuses: CustomerRescueRequestStatus[] = ['pending'];

export interface CustomerHistoryCardProps {
  request: CustomerRescueRequest;
  onCancel: (req: CustomerRescueRequest) => void;
  onClick?: () => void;
}

export function CustomerHistoryCard({ request, onCancel, onClick }: CustomerHistoryCardProps) {
  const canCancel = request.status ? cancellableStatuses.includes(request.status) : false;

  return (
    <Box
      component={onClick ? 'button' : 'div'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      sx={{
        width: '100%',
        p: 2,
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        bgcolor: '#fff',
        textAlign: 'left',
        cursor: onClick ? 'pointer' : 'default',
        '&:active': onClick ? { transform: 'scale(0.98)' } : {},
      }}
    >
      <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }} noWrap>
            {request.company.company_name || 'Chưa có thông tin công ty'}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: '#4b5563', lineHeight: 1.35 }}>
            {request.description}
          </Typography>
        </Box>
        <Typography sx={{ flexShrink: 0, fontSize: 12, fontWeight: 800, color: ORANGE, lineHeight: 1.25 }}>
          {request.status ? statusTextByValue[request.status] : 'Đang xử lý'}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#6b7280' }}>
          <AccessTimeOutlined sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13, lineHeight: 1.25 }}>{formatDateTime(request.created_at)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#6b7280' }}>
          <SecurityOutlined sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 13, lineHeight: 1.25 }}>
            Dự kiến đến: {request.eta_minutes ? `~${request.eta_minutes} phút` : 'Chưa có thời gian dự kiến'}
          </Typography>
        </Box>
      </Box>

      {canCancel && (
        <Box sx={{ mt: 1.5 }} onClick={(e) => e.stopPropagation()}>
          <CancelButton status={request.status!} onCancel={() => onCancel(request)} />
        </Box>
      )}
    </Box>
  );
}
