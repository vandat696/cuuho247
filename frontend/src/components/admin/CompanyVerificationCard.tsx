import { Box, Typography } from '@mui/material';
import {
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  LocationOnOutlined as LocationIcon,
  AccessTimeOutlined as ClockIcon,
} from '@mui/icons-material';
import { Company } from '@/types/common.type';
import { NAVY, ORANGE, CARD_RADIUS } from '@/constants/colors';
import { formatAddress, formatTimeAgo } from '@/components/rescue-company/RescueCompanyRequestShared';
import { Button } from '@/components/common/Button';

interface CompanyVerificationCardProps {
  company: Company;
  onClick: () => void;
}

export const CompanyVerificationCard = ({ company, onClick }: CompanyVerificationCardProps) => {
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
            bgcolor: 'rgba(255, 107, 0, 0.1)',
            color: ORANGE,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          Chờ duyệt
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
          <PersonIcon sx={{ fontSize: 18, color: NAVY }} />
          <Typography sx={{ fontSize: 14, lineHeight: 1.3 }}>Người đại diện: {company.director_name}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#4b5563' }}>
          <PhoneIcon sx={{ fontSize: 18, color: NAVY }} />
          <Typography sx={{ fontSize: 14, lineHeight: 1.3 }}>Số điện thoại: {company.phone}</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, color: '#4b5563' }}>
          <LocationIcon sx={{ fontSize: 18, color: NAVY, mt: 0.25 }} />
          <Typography sx={{ fontSize: 14, lineHeight: 1.3, minWidth: 0, flex: 1 }}>
            {formatAddress(company.address)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#6b7280' }}>
          <ClockIcon sx={{ fontSize: 16 }} />
          <Typography sx={{ fontSize: 12, lineHeight: 1.3 }}>
            Cập nhật {formatTimeAgo(company.updated_at || company.created_at)}
          </Typography>
        </Box>
      </Box>

      <Button variant="secondary" fullWidth onClick={onClick}>
        Xem chi tiết hồ sơ
      </Button>
    </Box>
  );
};
