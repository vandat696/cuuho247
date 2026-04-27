import { ButtonHTMLAttributes, ReactNode } from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  disabled,
  className,
  type = 'button',
  startIcon,
  endIcon,
  ...props
}: ButtonProps) {
  let muiVariant: MuiButtonProps['variant'] = 'contained';
  let muiColor: MuiButtonProps['color'] = 'primary';

  if (variant === 'secondary') {
    muiVariant = 'contained';
    muiColor = 'secondary';
  } else if (variant === 'outline') {
    muiVariant = 'outlined';
    muiColor = 'primary';
  } else if (variant === 'ghost') {
    muiVariant = 'text';
    muiColor = 'inherit';
  }

  let muiSize: MuiButtonProps['size'] = 'medium';
  if (size === 'sm') muiSize = 'small';
  if (size === 'lg') muiSize = 'large';

  return (
    <MuiButton
      type={type}
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      className={className}
      startIcon={loading ? <CircularProgress size={18} color="inherit" /> : startIcon}
      endIcon={endIcon}
      sx={{
        ...(loading && {
          '&.Mui-disabled': {
            backgroundColor: muiVariant === 'contained' && muiColor !== 'inherit' ? `${muiColor}.main` : undefined,
            color:
              muiVariant === 'contained' && muiColor !== 'inherit'
                ? `${muiColor}.contrastText`
                : muiColor !== 'inherit'
                  ? `${muiColor}.main`
                  : 'inherit',
            opacity: 0.6,
          },
        }),
        ...(variant === 'ghost' && {
          color: 'text.secondary',
          '&:hover': {
            backgroundColor: 'background.default',
          },
        }),
      }}
      {...(props as any)}
    >
      {children}
    </MuiButton>
  );
}
