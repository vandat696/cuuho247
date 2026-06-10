import { Box, Typography } from '@mui/material';
import {
  CheckCircleOutline as CheckIcon,
  HighlightOff as RejectIcon,
  ContactMailOutlined as DocsIcon,
  HistoryOutlined as ClockIcon,
} from '@mui/icons-material';
import { AuditLog } from '@/services/admin.service';
import { GREEN, RED, ORANGE, CARD_RADIUS } from '@/constants/colors';
import { formatDateTime } from '@/utils/format';

interface CompanyLogHistoryProps {
  logs: AuditLog[];
}

const actionConfigs: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  lock_company: {
    label: 'Khóa tài khoản',
    color: RED,
    icon: <RejectIcon sx={{ color: RED, fontSize: 18 }} />,
  },
  unlock_company: {
    label: 'Mở khóa tài khoản',
    color: GREEN,
    icon: <CheckIcon sx={{ color: GREEN, fontSize: 18 }} />,
  },
  verify_company: {
    label: 'Duyệt hoạt động',
    color: GREEN,
    icon: <CheckIcon sx={{ color: GREEN, fontSize: 18 }} />,
  },
  reject_company: {
    label: 'Từ chối hồ sơ',
    color: RED,
    icon: <RejectIcon sx={{ color: RED, fontSize: 18 }} />,
  },
  request_more_docs: {
    label: 'Yêu cầu giấy tờ',
    color: ORANGE,
    icon: <DocsIcon sx={{ color: ORANGE, fontSize: 18 }} />,
  },
};

export const CompanyLogHistory = ({ logs }: CompanyLogHistoryProps) => {
  if (logs.length === 0) {
    return (
      <Box sx={{ py: 3, textAlign: 'center', color: '#6b7280' }}>
        <Typography sx={{ fontSize: 13, fontStyle: 'italic' }}>
          Chưa ghi nhận lịch sử thay đổi trạng thái nào cho tài khoản này.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {logs.map((log) => {
        const cfg = actionConfigs[log.action] || {
          label: log.action,
          color: '#1b3a5d',
          icon: <CheckIcon sx={{ color: '#1b3a5d', fontSize: 18 }} />,
        };

        const reason = log.details?.reason || log.reason || '';

        return (
          <Box
            key={log._id}
            sx={{
              p: 2,
              border: '1px solid #e5e7eb',
              borderRadius: CARD_RADIUS,
              bgcolor: '#f9fafb',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {cfg.icon}
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: cfg.color }}>{cfg.label}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#9ca3af' }}>
                <ClockIcon sx={{ fontSize: 14 }} />
                <Typography sx={{ fontSize: 11 }}>{formatDateTime(log.created_at)}</Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 0.5 }}>
              <Typography sx={{ fontSize: 12.5, color: '#4b5563' }}>
                <strong>Người thực hiện:</strong> {log.admin_id?.full_name || 'Hệ thống'} (
                {log.admin_id?.email || 'N/A'})
              </Typography>
              {reason && (
                <Box
                  sx={{
                    mt: 1,
                    p: 1,
                    borderRadius: '6px',
                    bgcolor: '#fff',
                    border: '1px solid #e5e7eb',
                  }}
                >
                  <Typography sx={{ fontSize: 12.5, color: '#4b5563', fontStyle: 'italic', lineHeight: 1.35 }}>
                    &ldquo;{reason}&rdquo;
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
