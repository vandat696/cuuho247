import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RescueLocation } from '@/types/rescue.type';
import { MiniMap } from '../location/MiniMap';

interface SearchResultHeaderProps {
  incidentTypeLabel: string;
  location: RescueLocation | null;
  totalResults: number;
  onFilter?: () => void;
}

export function SearchResultHeader({ location, totalResults, onFilter }: SearchResultHeaderProps) {
  return (
    <Box>
      {/* Map Section */}
      <Box sx={{ p: 0, position: 'relative' }}>
        {location && location.lat !== 0 && location.lng !== 0 ? (
          <MiniMap lat={location.lat} lng={location.lng} />
        ) : (
          <Box
            sx={{
              height: 200,
              bgcolor: '#f5f7fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Không có dữ liệu bản đồ
            </Typography>
          </Box>
        )}
      </Box>

      {/* Location Address Info */}
      <Box
        sx={{
          bgcolor: '#fff',
          py: 2,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          borderBottom: '1px solid #edf2f7',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: '#1e3a5f',
            mb: 0.5,
            fontSize: 16,
          }}
        >
          Vị trí của bạn
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#718096',
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {location?.address || 'Chưa xác định'}
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
