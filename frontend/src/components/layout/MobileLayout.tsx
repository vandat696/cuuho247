import { ReactNode } from 'react';
import Box from '@mui/material/Box';

interface MobileLayoutProps {
  children: ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '430px' /* var(--mobile-max) */,
        minHeight: '100dvh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden',
        position: 'relative',
        margin: '0 auto' /* To center it when window > max-width */,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {children}
    </Box>
  );
}
