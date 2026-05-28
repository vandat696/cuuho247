import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { NAVY, CARD_RADIUS } from '@/constants/colors';

interface ActionCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

/**
 * Card điều hướng nhanh có icon, tiêu đề và mô tả ngắn.
 * Dùng trong mục "Quản lý nhanh" ở CompanyHomePage.
 */
export const ActionCard = ({ icon, title, description, onClick }: ActionCardProps) => (
  <Box
    component="button"
    type="button"
    onClick={onClick}
    sx={{
      width: '100%',
      p: 2,
      border: '2px solid #e5e7eb',
      borderRadius: CARD_RADIUS,
      bgcolor: '#fff',
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      textAlign: 'left',
      color: NAVY,
      transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
      '&:hover': { bgcolor: '#F5F7FA', borderColor: '#e5e7eb' },
      '&:active': { transform: 'scale(0.99)' },
    }}
  >
    <Box sx={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {icon}
    </Box>
    <Box sx={{ minWidth: 0, flex: 1 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 500, color: NAVY, lineHeight: 1.25 }}>{title}</Typography>
      <Typography sx={{ mt: 0.25, fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{description}</Typography>
    </Box>
  </Box>
);
