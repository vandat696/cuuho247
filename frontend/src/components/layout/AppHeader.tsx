import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldOutlined as ShieldOutlinedIcon } from '@mui/icons-material';

interface AppHeaderProps {
  title: string;
  onBack?: () => void; // override default navigate(-1)
  showBack?: boolean;
  rightSlot?: ReactNode; // e.g. notification icon
}

export function AppHeader({ title, onBack, showBack = true, rightSlot }: AppHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="app-header">
      {showBack ? (
        <button type="button" className="app-header__back" onClick={handleBack} aria-label="Quay lại">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      ) : (
        <div className="app-header__logo" aria-hidden="true">
          <ShieldOutlinedIcon sx={{ fontSize: 18 }} />
        </div>
      )}

      <div className={showBack ? 'app-header__center' : 'app-header__center app-header__center--start'}>
        <h1 className="app-header__title">{title}</h1>
      </div>

      <div className="app-header__action">{rightSlot ?? null}</div>
    </header>
  );
}
