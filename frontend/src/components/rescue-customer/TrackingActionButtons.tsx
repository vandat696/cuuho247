import { Box } from '@mui/material';
import { ChatBubbleOutline, StarOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
// removed toast

import { NAVY, ORANGE } from '@/components/rescue-company/RescueCompanyRequestShared';
import { CancelButton } from '@/components/rescue-customer/CancelButton';
import { CustomerRescueRequestStatus } from '@/services/customer-rescue.service';

interface TrackingActionButtonsProps {
  requestId: string;
  status?: CustomerRescueRequestStatus;
  onCancelClick: () => void;
  onResendClick?: () => void;
}

export const TrackingActionButtons = ({
  requestId,
  status,
  onCancelClick,
  onResendClick,
}: TrackingActionButtonsProps) => {
  const navigate = useNavigate();

  const handleReview = () => {
    navigate(`/customer/review/${requestId}`);
  };

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

      {status === 'rejected' && onResendClick && (
        <Box
          component="button"
          onClick={onResendClick}
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
          Gửi lại yêu cầu
        </Box>
      )}

      {(status === 'cancelled' || status === 'rejected' || status === 'completed') && (
        <>
          <Box
            component="button"
            onClick={() => navigate(`/chat/${requestId}`)}
            sx={{
              width: '100%',
              bgcolor: '#fff',
              color: NAVY,
              border: `2px solid ${NAVY}`,
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
            Xem tin nhắn
          </Box>
        </>
      )}

      {status === 'completed' && (
        <Box
          component="button"
          onClick={handleReview}
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

      {(status === 'pending' || status === 'accepted' || status === 'in_progress') && (
        <Box>
          <CancelButton status={status} onCancel={onCancelClick} />
        </Box>
      )}
    </Box>
  );
};
