import { Box, Typography } from '@mui/material';
import {
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  MailOutline as MailIcon,
  AccessTimeOutlined as ClockIcon,
} from '@mui/icons-material';
import { Company } from '@/types/common.type';
import { NAVY, GREEN, RED, ORANGE, CARD_RADIUS } from '@/constants/colors';
import { formatTimeAgo } from '@/components/rescue-company/RescueCompanyRequestShared';
import { Button } from '@/components/common/Button';

interface CompanyCardProps {
  company: Company;
  onClick: () => void;
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'Hoạt động', bg: 'rgba(22, 163, 74, 0.1)', text: GREEN },
  locked: { label: 'Đã khóa', bg: 'rgba(220, 38, 38, 0.1)', text: RED },
  pending_verification: { label: 'Chờ duyệt', bg: 'rgba(255, 107, 0, 0.1)', text: ORANGE },
  rejected: { label: 'Từ chối', bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' },
};

export const CompanyCard = ({ company, onClick }: CompanyCardProps) => {
  const status = company.status || 'pending_verification';
  const cfg = statusConfig[status] || { label: status, bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' };

  return (
    <Box
      sx={{
        p: 2.5,
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>
          {company.company_name}
        </Typography>
        <Box
          component="span"
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: '9999px',
            bgcolor: cfg.bg,
            color: cfg.text,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          {cfg.label}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
          <PersonIcon sx={{ fontSize: 18, color: NAVY }} />
          <Typography sx={{ fontSize: 14, lineHeight: 1.3 }}>Đại diện: {company.director_name}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
          <MailIcon sx={{ fontSize: 18, color: NAVY }} />
          <Typography sx={{ fontSize: 14, lineHeight: 1.3 }} noWrap>
            {company.email}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
          <PhoneIcon sx={{ fontSize: 18, color: NAVY }} />
          <Typography sx={{ fontSize: 14, lineHeight: 1.3 }}>Số điện thoại: {company.phone}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280' }}>
          <ClockIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 12, lineHeight: 1.3 }}>
            Cập nhật {formatTimeAgo(company.updated_at || company.created_at)}
          </Typography>
        </Box>
      </Box>

      <Button variant="secondary" fullWidth onClick={onClick}>
        Xem chi tiết đối tác
      </Button>
    </Box>
  );
};
