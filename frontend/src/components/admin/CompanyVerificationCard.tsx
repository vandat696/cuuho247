import { Box, Typography } from '@mui/material';
import {
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  LocationOnOutlined as LocationIcon,
  AccessTimeOutlined as ClockIcon,
} from '@mui/icons-material';
import { Company } from '@/types/common.type';
import { NAVY, ORANGE } from '@/constants/colors';
import { formatAddress, formatTimeAgo } from '@/components/rescue-company/RescueCompanyRequestShared';
import AdminCard from './AdminCard';

interface CompanyVerificationCardProps {
  company: Company;
  onClick: () => void;
}

export const CompanyVerificationCard = ({ company, onClick }: CompanyVerificationCardProps) => {
  return (
    <AdminCard
      title={company.company_name}
      badgeLabel="Chờ duyệt"
      badgeBg="rgba(255, 107, 0, 0.1)"
      badgeColor={ORANGE}
      buttonText="Xem chi tiết hồ sơ"
      onClick={onClick}
      padding={2}
    >
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
    </AdminCard>
  );
};
