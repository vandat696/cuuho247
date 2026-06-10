import { Box, Typography } from '@mui/material';
import { NAVY, CARD_RADIUS } from '@/constants/colors';

interface ServiceTypeStat {
  categoryId: string;
  name: string;
  count: number;
  percentage: number;
}

interface ReportServiceStatsProps {
  stats: ServiceTypeStat[];
}

export default function ReportServiceStats({ stats }: ReportServiceStatsProps) {
  return (
    <Box
      sx={{
        p: 2.5,
        mb: 3,
        borderRadius: CARD_RADIUS,
        border: '1px solid #e5e7eb',
        bgcolor: '#fff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, mb: 2 }}>Phân loại theo dịch vụ</Typography>

      {stats.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: '#6b7280', py: 2, textAlign: 'center' }}>
          Không có dữ liệu phân loại dịch vụ.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {stats.map((item) => (
            <Box key={item.categoryId}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{item.name}</Typography>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: NAVY }}>{item.count} ca</Typography>
                  <Typography sx={{ fontSize: 11, color: '#6b7280' }}>({item.percentage}%)</Typography>
                </Box>
              </Box>

              {/* Progress bar container */}
              <Box
                sx={{
                  width: '100%',
                  height: 8,
                  borderRadius: '4px',
                  bgcolor: '#f3f4f6',
                  overflow: 'hidden',
                }}
              >
                {/* Active progress */}
                <Box
                  sx={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    borderRadius: '4px',
                    bgcolor: NAVY,
                    background: `linear-gradient(90deg, ${NAVY} 0%, #3b82f6 100%)`,
                    transition: 'width 0.5s ease-out',
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
