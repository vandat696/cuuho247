import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface DesktopLayoutProps {
  children: ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <Box
      className="desktop-shell"
      sx={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        bgcolor: '#f8fafc',
        zIndex: 1000,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {children}
    </Box>
  );
}
