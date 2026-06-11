import { Box, Typography } from '@mui/material';
import {
  ChatBubbleOutlineRounded as MessageIcon,
  CheckCircleOutlineRounded as CheckIcon,
  ErrorOutlineRounded as AlertIcon,
} from '@mui/icons-material';
import { NAVY, ORANGE, CARD_RADIUS, CIRCLE_RADIUS } from '@/constants/colors';

export type NotificationKind = 'success' | 'message' | 'warning';

export interface SharedNotificationData {
  id: string;
  title: string;
  body: string;
  timeAgo: string;
  createdAt: number;
  kind: NotificationKind;
  isRead: boolean;
  detailPath: string;
}

const iconByKind = {
  success: <CheckIcon sx={{ fontSize: 24, color: '#22c55e' }} />,
  message: <MessageIcon sx={{ fontSize: 24, color: '#3b82f6' }} />,
  warning: <AlertIcon sx={{ fontSize: 24, color: '#eab308' }} />,
};

interface NotificationCardProps {
  notification: SharedNotificationData;
  onClick: () => void;
}

/**
 * Shared NotificationCard component for displaying standard user/company notifications.
 */
export const NotificationCard = ({ notification, onClick }: NotificationCardProps) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      width: '100%',
      p: 2,
      border: '2px solid',
      borderColor: notification.isRead ? '#e5e7eb' : ORANGE,
      borderRadius: CARD_RADIUS,
      bgcolor: notification.isRead ? '#fff' : 'rgba(255, 107, 0, 0.05)',
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'border-color 0.15s, background 0.15s, transform 0.1s',
      '&:hover': { borderColor: notification.isRead ? '#cbd5e1' : ORANGE, bgcolor: '#fff7ed' },
      '&:active': { transform: 'scale(0.99)' },
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <Box sx={{ flexShrink: 0 }}>{iconByKind[notification.kind]}</Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography sx={{ mb: 0.5, fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
          {notification.title}
        </Typography>
        <Typography sx={{ mb: 1, fontSize: 14, color: '#374151', lineHeight: 1.35 }}>{notification.body}</Typography>
        <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{notification.timeAgo}</Typography>
      </Box>

      {!notification.isRead && (
        <Box sx={{ mt: 1, width: 8, height: 8, borderRadius: CIRCLE_RADIUS, bgcolor: ORANGE, flexShrink: 0 }} />
      )}
    </Box>
  </Box>
);
