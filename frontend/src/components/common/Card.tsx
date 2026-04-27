import { HTMLAttributes, ReactNode } from 'react';

type CardVariant = 'default' | 'shadow' | 'orange' | 'navy';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'md' | 'lg' | 'none';
  children: ReactNode;
}

export function Card({ variant = 'default', padding = 'md', children, className = '', ...props }: CardProps) {
  const classes = ['card', variant !== 'default' ? `card--${variant}` : '', className].filter(Boolean).join(' ');

  const bodyClass = padding === 'none' ? '' : padding === 'lg' ? 'card-body-lg' : 'card-body';

  return (
    <div className={classes} {...props}>
      <div className={bodyClass}>{children}</div>
    </div>
  );
}
