import { HTMLAttributes, ReactNode, KeyboardEvent } from 'react';

type CardVariant = 'default' | 'shadow' | 'orange' | 'navy';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: 'md' | 'lg' | 'none';
  children: ReactNode;
}

export function Card({ variant = 'default', padding = 'md', children, className = '', onClick, ...props }: CardProps) {
  const classes = ['card', variant !== 'default' ? `card--${variant}` : '', className].filter(Boolean).join(' ');

  const bodyClass = padding === 'none' ? '' : padding === 'lg' ? 'card-body-lg' : 'card-body';

  const handleKeyDown = onClick
    ? (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.currentTarget.click();
        }
      }
    : undefined;

  return (
    <div
      className={classes}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      <div className={bodyClass}>{children}</div>
    </div>
  );
}
