import { Typography, Box } from '@mui/material';
import { DirectionsCar } from '@mui/icons-material';
import { CustomerRescueRequest } from '@/services/rescueRequest.service';
import { NAVY } from '@/components/rescue-company/RescueCompanyRequestShared';

interface TrackingVehicleInfoProps {
  request: CustomerRescueRequest;
}

export const TrackingVehicleInfo = ({ request }: TrackingVehicleInfoProps) => {
  return (
    <Box
      sx={{
        p: 3,
        mb: 2,
        borderRadius: '16px',
        background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
        color: '#fff',
      }}
    >
      <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 700, color: '#fff' }}>Thông tin xe cứu hộ</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <DirectionsCar sx={{ fontSize: 20, opacity: 0.8, color: '#fff' }} />
          <Typography sx={{ fontSize: 15, color: '#fff' }}>
            Loại xe: {request.company.company_name || 'Xe kéo ô tô'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: '4px',
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            12
          </Box>
          <Typography sx={{ fontSize: 15, color: '#fff' }}>
            Biển số xe:{' '}
            {request.vehicle?.plate_number || (request.company.company_name ? 'Đã phân công' : 'Chưa có biển số')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
