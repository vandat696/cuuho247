import { HTMLAttributes, ReactNode, KeyboardEvent } from 'react';
import MuiCard from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import Box from '@mui/material/Box';

type CardVariant = 'default' | 'shadow' | 'orange' | 'navy';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'md' | 'lg' | 'none';
  children: ReactNode;
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

  const sx: any = {
    cursor: onClick ? 'pointer' : 'default',
  };

  if (variant === 'shadow') {
    sx.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.08)';
    sx.border = 'none';
  } else if (variant === 'orange') {
    sx.backgroundColor = 'primary.light';
    sx.borderColor = '#ffcc99';
  } else if (variant === 'navy') {
    sx.backgroundColor = 'secondary.main';
    sx.border = 'none';
    sx.color = 'secondary.contrastText';
  }

  let p = 0;
  if (padding === 'md') p = 2; // 16px
  if (padding === 'lg') p = 3; // 24px

  return (
    <MuiCard className={className} sx={sx} {...(props as any)}>
      {onClick ? (
        <CardActionArea component="div" onClick={onClick as any} onKeyDown={handleKeyDown as any} tabIndex={0}>
          <Box sx={{ p }}>{children}</Box>
        </CardActionArea>
      ) : (
        <Box sx={{ p }}>{children}</Box>
      )}
    </MuiCard>
  );
}
