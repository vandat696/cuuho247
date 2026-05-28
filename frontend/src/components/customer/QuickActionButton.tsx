import type { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { CARD_RADIUS } from '@/constants/colors';

interface QuickActionButtonProps {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

/**
 * Nút hành động nhanh dạng ô vuông có icon + label.
 * Dùng trong grid 3 cột ở trang chủ customer.
 */
export function QuickActionButton({ icon, label, onClick }: QuickActionButtonProps) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        minHeight: 104,
        p: 2,
        bgcolor: '#fff',
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        color: '#1B3A5D',
        transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
        '&:hover': { bgcolor: '#F5F7FA', borderColor: '#d1d5db' },
        '&:active': { transform: 'scale(0.98)' },
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#374151', lineHeight: 1.25 }}>{label}</Typography>
    </Box>
  );
}
