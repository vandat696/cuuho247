import { Box, Typography } from '@mui/material';
import React from 'react';

interface InfoFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}

export const InfoField = ({ icon, label, value }: InfoFieldProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2.5, alignItems: 'flex-start' }}>
      <Box sx={{ color: 'text.secondary', fontSize: '20px', pt: 0.5 }}>{icon}</Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: '13px' }}>
          {label}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '15px' }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
};
