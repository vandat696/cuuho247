import { Box, Typography } from '@mui/material';
import {
  AdminPanelSettingsOutlined as AdminIcon,
  CheckCircleOutline as CheckIcon,
  HighlightOff as RejectIcon,
  ContactMailOutlined as DocsIcon,
  HistoryOutlined as ClockIcon,
} from '@mui/icons-material';
import { AuditLog } from '@/services/admin.service';
import { NAVY, GREEN, RED, ORANGE, CARD_RADIUS } from '@/constants/colors';
import { formatDateTime } from '@/utils/format';

interface AuditLogItemProps {
  log: AuditLog;
}

const actionLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  verify_company: {
    label: 'Duyệt hoạt động',
    color: GREEN,
    icon: <CheckIcon sx={{ color: GREEN, fontSize: 20 }} />,
  },
  reject_company: {
    label: 'Từ chối hồ sơ',
    color: RED,
    icon: <RejectIcon sx={{ color: RED, fontSize: 20 }} />,
  },
  request_more_docs: {
    label: 'Yêu cầu giấy tờ',
    color: ORANGE,
    icon: <DocsIcon sx={{ color: ORANGE, fontSize: 20 }} />,
  },
  lock_user: {
    label: 'Khóa tài khoản',
    color: RED,
    icon: <RejectIcon sx={{ color: RED, fontSize: 20 }} />,
  },
  unlock_user: {
    label: 'Mở khóa tài khoản',
    color: GREEN,
    icon: <CheckIcon sx={{ color: GREEN, fontSize: 20 }} />,
  },
  lock_company: {
    label: 'Khóa tài khoản đối tác',
    color: RED,
    icon: <RejectIcon sx={{ color: RED, fontSize: 20 }} />,
  },
  unlock_company: {
    label: 'Mở khóa tài khoản đối tác',
    color: GREEN,
    icon: <CheckIcon sx={{ color: GREEN, fontSize: 20 }} />,
  },
};

export const AuditLogItem = ({ log }: AuditLogItemProps) => {
  const actionInfo = actionLabels[log.action] || {
    label: log.action,
    color: NAVY,
    icon: <AdminIcon sx={{ color: NAVY, fontSize: 20 }} />,
  };

  const reason = log.details?.reason || log.reason || '';

  return (
    <Box
      sx={{
        p: 2,
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actionInfo.icon}
          <Typography sx={{ fontSize: 15, fontWeight: 800, color: actionInfo.color }}>{actionInfo.label}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6b7280' }}>
          <ClockIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 12 }}>{formatDateTime(log.created_at)}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Typography sx={{ fontSize: 13, color: '#4b5563' }}>
          <strong>Quản trị viên:</strong> {log.admin_id?.full_name || 'Hệ thống'} ({log.admin_id?.email || 'N/A'})
        </Typography>
        <Typography sx={{ fontSize: 13, color: '#4b5563' }} noWrap>
          {log.target_type === 'company' ? (
            <>
              <strong>Công ty:</strong> {log.target_name || log.target_id}
            </>
          ) : log.target_type === 'user' ? (
            <>
              <strong>Người dùng:</strong> {log.target_name || log.target_id}
            </>
          ) : (
            <>
              <strong>Đối tượng ({log.target_type}):</strong> {log.target_name || log.target_id}
            </>
          )}
        </Typography>
        {reason && (
          <Box sx={{ mt: 1, p: 1.25, borderRadius: '8px', bgcolor: '#f9fafb', border: '1px solid #f3f4f6' }}>
            <Typography sx={{ fontSize: 13, color: '#4b5563', fontStyle: 'italic', lineHeight: 1.4 }}>
              &ldquo;{reason}&rdquo;
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};
