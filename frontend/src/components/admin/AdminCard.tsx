import { ReactNode } from 'react';
import { Box, Typography } from '@mui/material';
import { NAVY, CARD_RADIUS } from '@/constants/colors';
import { Button } from '@/components/common/Button';

interface AdminCardProps {
  title: string;
  badgeLabel: string;
  badgeBg: string;
  badgeColor: string;
  buttonText: string;
  onClick: () => void;
  children: ReactNode;
  padding?: number | string;
}

export default function AdminCard({
  title,
  badgeLabel,
  badgeBg,
  badgeColor,
  buttonText,
  onClick,
  children,
  padding = 2.5,
}: AdminCardProps) {
  return (
    <Box
      sx={{
        p: padding,
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, lineHeight: 1.25 }}>{title}</Typography>
        <Box
          component="span"
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: '9999px',
            bgcolor: badgeBg,
            color: badgeColor,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.25,
            whiteSpace: 'nowrap',
          }}
        >
          {badgeLabel}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>{children}</Box>

      <Button variant="secondary" fullWidth onClick={onClick}>
        {buttonText}
      </Button>
    </Box>
  );
}
