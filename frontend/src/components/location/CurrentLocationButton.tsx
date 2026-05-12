import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

interface CurrentLocationButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export function CurrentLocationButton({ onClick, loading }: CurrentLocationButtonProps) {
  return (
    <Box sx={{ flexShrink: 0 }}>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        style={{
          width: 56,
          height: 56,
          borderRadius: 12,
          border: 'none',
          backgroundColor: '#1e3a5f',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: loading ? 0.6 : 1,
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)',
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: '#fff' }} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        )}
      </button>
    </Box>
  );
}
