import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/common/Button';

interface SearchResultHeaderProps {
  incidentTypeLabel: string;
  address: string;
  totalResults: number;
  onFilter?: () => void;
}

export function SearchResultHeader({ address, totalResults, onFilter }: SearchResultHeaderProps) {
  return (
    <Box>
      {/* Location Section */}
      <Box
        sx={{
          bgcolor: '#f5f7fa',
          pt: 5,
          pb: 4,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Orange Map Pin Icon */}
        <Box
          sx={{
            width: 72,
            height: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1.5,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 24 24" fill="#ff6b00">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1e3a5f',
            mb: 0.5,
            fontSize: 18,
          }}
        >
          Vị trí của bạn
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#718096',
            fontSize: 14,
            maxWidth: '80%',
            lineHeight: 1.5,
          }}
        >
          {address}
        </Typography>
      </Box>

      {/* Blue Divider Line */}
      <Box sx={{ height: 3, bgcolor: '#1e3a5f', width: '100%' }} />

      {/* Results Count & Filter Row */}
      <Box
        sx={{
          px: 2,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1e3a5f',
            fontSize: 20,
          }}
        >
          Tìm thấy {totalResults} công ty cứu hộ
        </Typography>

        <Box
          component="button"
          onClick={onFilter}
          sx={{
            border: 'none',
            bgcolor: 'transparent',
            color: '#1e3a5f',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
          }}
        >
          Lọc
        </Box>
      </Box>
    </Box>
  );
}
