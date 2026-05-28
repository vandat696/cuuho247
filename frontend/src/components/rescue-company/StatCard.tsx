import { Box, Typography } from '@mui/material';
import { CARD_RADIUS } from '@/constants/colors';

interface StatCardProps {
  value: number | string;
  label: string;
  color: string;
  hoverColor: string;
  onClick?: () => void;
}

/**
 * Card hiển thị số liệu thống kê (đang chờ, đang thực hiện, hoàn thành, đã hủy).
 * Dùng trong CompanyHomePage.
 */
export const StatCard = ({ value, label, color, hoverColor, onClick }: StatCardProps) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      minHeight: 92,
      p: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'border-color 0.15s, transform 0.1s',
      '&:hover': { borderColor: hoverColor },
      '&:active': { transform: 'scale(0.99)' },
    }}
  >
    <Typography sx={{ fontSize: 24, lineHeight: 1, fontWeight: 800, color }}>{value}</Typography>
    <Typography sx={{ mt: 1, fontSize: 12, color: '#4b5563', lineHeight: 1.2 }}>{label}</Typography>
  </Box>
);
