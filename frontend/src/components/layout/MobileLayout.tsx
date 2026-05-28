import { ReactNode } from 'react';
import { Box } from '@mui/material';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <Box
      className="mobile-shell"
      sx={{
        width: '100%',
        maxWidth: '375px',
        height: '100dvh',
        backgroundColor: '#fff',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        margin: '0 auto',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {children}
    </Box>
  );
}
