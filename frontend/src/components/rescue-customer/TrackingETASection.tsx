import { Box, Typography, CircularProgress } from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import { NAVY, ORANGE } from '@/components/rescue-company/RescueCompanyRequestShared';

interface TrackingETASectionProps {
  remainingEta: number;
}

export const TrackingETASection = ({ remainingEta }: TrackingETASectionProps) => {
  return (
    <Box sx={{ px: 2, pt: 3, pb: 1 }}>
      <Box
        sx={{
          bgcolor: NAVY,
          borderRadius: '16px',
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 8px 24px rgba(27, 58, 93, 0.15)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background element */}
        <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.05, transform: 'rotate(-15deg)' }}>
          <DirectionsCar sx={{ fontSize: 140, color: '#fff' }} />
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', mb: 0.5, fontWeight: 600 }}>
            Đội cứu hộ đang đến
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
            <Typography sx={{ fontSize: 36, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{remainingEta}</Typography>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: ORANGE }}>phút</Typography>
          </Box>
        </Box>

        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            bgcolor: 'rgba(255, 107, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <CircularProgress
            variant="indeterminate"
            disableShrink
            size={52}
            thickness={4}
            sx={{ position: 'absolute', color: ORANGE, animationDuration: '2s' }}
          />
          <DirectionsCar sx={{ color: ORANGE, fontSize: 24 }} />
        </Box>
      </Box>
    </Box>
  );
};
