import { Box } from '@mui/material';
import { ChatBubbleOutline, StarOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { NAVY, ORANGE } from '@/components/rescue-company/RescueCompanyRequestShared';
import { CancelButton } from '@/components/rescue-customer/CancelButton';
import { CustomerRescueRequestStatus } from '@/services/rescueRequestCustomer.service';

interface TrackingActionButtonsProps {
  requestId: string;
  status?: CustomerRescueRequestStatus;
  onCancelClick: () => void;
}

export const TrackingActionButtons = ({ requestId, status, onCancelClick }: TrackingActionButtonsProps) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {status && ['pending', 'accepted', 'in_progress', 'arrived'].includes(status) && (
        <Box
          component="button"
          onClick={() => navigate(`/chat/${requestId}`)}
          sx={{
            width: '100%',
            bgcolor: NAVY,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <ChatBubbleOutline sx={{ fontSize: 22 }} />
          Nhắn tin
        </Box>
      )}

      {(status === 'cancelled' || status === 'rejected' || status === 'completed') && (
        <Box
          component="button"
          onClick={() => navigate('/customer/home')}
          sx={{
            width: '100%',
            bgcolor: NAVY,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Quay về trang chủ
        </Box>
      )}

      {status === 'completed' && (
        <Box
          component="button"
          onClick={() => toast.success('Tính năng đánh giá đang được phát triển')}
          sx={{
            width: '100%',
            bgcolor: ORANGE,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontSize: 16,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <StarOutline sx={{ fontSize: 22 }} />
          Đánh giá dịch vụ
        </Box>
      )}

      {status === 'pending' && (
        <Box sx={{ mt: 2 }}>
          <CancelButton status={status} onCancel={onCancelClick} />
        </Box>
      )}
    </Box>
  );
};
