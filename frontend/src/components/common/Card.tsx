import { KeyboardEvent } from 'react';
import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card';
import { CardActionAreaProps } from '@mui/material/CardActionArea';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';
import { Theme, SxProps } from '@mui/material/styles';

type CardVariant = 'default' | 'shadow' | 'orange' | 'navy';

interface CardProps extends Omit<MuiCardProps, 'variant' | 'onClick'> {
  variant?: CardVariant;
  padding?: 'md' | 'lg' | 'none';
  onClick?: CardActionAreaProps<'div'>['onClick'];
}

export function Card({ variant = 'default', padding = 'md', children, className, onClick, ...props }: CardProps) {
  const handleKeyDown = onClick
    ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.currentTarget.click();
        }
      }
    : undefined;

  let sx: SxProps<Theme> = {
    cursor: onClick ? 'pointer' : 'default',
  };

  if (variant === 'shadow') {
    sx = { ...sx, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)', border: 'none' };
  } else if (variant === 'orange') {
    sx = { ...sx, backgroundColor: 'primary.light', borderColor: '#ffcc99' };
  } else if (variant === 'navy') {
    sx = { ...sx, backgroundColor: 'secondary.main', border: 'none', color: 'secondary.contrastText' };
  }

  let p = 0;
  if (padding === 'md') p = 2; // 16px
  if (padding === 'lg') p = 3; // 24px

  return (
    <MuiCard className={className} sx={sx} {...props}>
      {onClick ? (
        <CardActionArea
          component="div"
          onClick={onClick}
          onKeyDown={handleKeyDown as React.KeyboardEventHandler<HTMLDivElement>}
          tabIndex={0}
        >
          <Box sx={{ p }}>{children}</Box>
        </CardActionArea>
      ) : (
        <Box sx={{ p }}>{children}</Box>
      )}
    </MuiCard>
  );
}
