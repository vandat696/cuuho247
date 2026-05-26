import { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApartmentOutlined as ApartmentIcon } from '@mui/icons-material';

interface AppHeaderProps {
  title: string;
  onBack?: () => void;
  backFallback?: string;
  showBack?: boolean;
  rightSlot?: ReactNode;
}

export function AppHeader({ title, onBack, backFallback = '/', showBack = true, rightSlot }: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate(backFallback, { replace: true });
    }
  };

  return (
    <header className="app-header">
      {showBack ? (
        <button type="button" className="app-header__back" onClick={handleBack} aria-label="Quay lại">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </button>
      ) : (
        <div className="app-header__logo" aria-hidden="true">
          <ApartmentIcon sx={{ fontSize: 24 }} />
        </div>
      )}

      <div className={showBack ? 'app-header__center' : 'app-header__center app-header__center--start'}>
        <h1 className="app-header__title">{title}</h1>
      </div>

      <div className="app-header__action">{rightSlot ?? null}</div>
    </header>
  );
}
