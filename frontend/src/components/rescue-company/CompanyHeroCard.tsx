import { Box, Typography } from '@mui/material';
import { NAVY, CIRCLE_RADIUS, CARD_RADIUS } from '@/constants/colors';

interface CompanyHeroCardProps {
  companyName: string;
  /** Có hiển thị trạng thái "Đang hoạt động" không */
  showStatus?: boolean;
  /** Nội dung thêm hiển thị dưới tên công ty */
  children?: React.ReactNode;
  onClick?: () => void;
}

/**
 * Gradient hero card hiển thị tên công ty và trạng thái hoạt động.
 * Dùng chung cho CompanyHomePage và CompanyProfilePage.
 */
export function CompanyHeroCard({ companyName, showStatus = true, children, onClick }: CompanyHeroCardProps) {
  return (
    <Box
      onClick={onClick}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: CARD_RADIUS,
        background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
        color: '#fff',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <Typography sx={{ mb: 0.5, fontSize: 20, fontWeight: 800, lineHeight: 1.25, color: '#fff' }}>
        {companyName}
      </Typography>
      {showStatus && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: CIRCLE_RADIUS, bgcolor: '#4ade80' }} />
          <Typography sx={{ fontSize: 14, color: '#fff', lineHeight: 1.25 }}>Đang hoạt động</Typography>
        </Box>
      )}
      {children}
    </Box>
  );
}
