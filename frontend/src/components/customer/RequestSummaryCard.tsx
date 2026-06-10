import { Box, Typography } from '@mui/material';
import { NAVY, ORANGE, CARD_RADIUS } from '@/constants/colors';
import { formatDateTime } from '@/utils/format';
import type { CustomerRescueRequest, CustomerRescueRequestStatus } from '@/services/customer-rescue.service';

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

interface RequestSummaryCardProps {
  request: CustomerRescueRequest;
  onClick?: () => void;
}

/**
 * Card tóm tắt một yêu cầu cứu hộ trong danh sách "Yêu cầu gần đây".
 * Hiển thị tên công ty, mô tả, thời gian và trạng thái.
 */
export function RequestSummaryCard({ request, onClick }: RequestSummaryCardProps) {
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
      <Typography sx={{ mb: 0.75, fontSize: 15, fontWeight: 800, color: NAVY, lineHeight: 1.25 }} noWrap>
        {request.company.company_name || 'Chưa có thông tin công ty'}
      </Typography>
      <Typography sx={{ mb: 0.75, fontSize: 13, color: '#4b5563', lineHeight: 1.35 }} noWrap>
        {request.description}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, alignItems: 'center' }}>
        <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>
          {formatDateTime(request.created_at)}
        </Typography>
        <Typography sx={{ fontSize: 12, fontWeight: 800, color: ORANGE, lineHeight: 1.25 }}>
          {request.status ? statusTextByValue[request.status] : 'Đang xử lý'}
        </Typography>
      </Box>
    </Box>
  );
}
