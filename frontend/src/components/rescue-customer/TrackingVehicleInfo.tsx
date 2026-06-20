import { Typography, Box } from '@mui/material';
import { LocalShippingOutlined as TruckIcon } from '@mui/icons-material';
import { CustomerRescueRequest } from '@/services/customer-rescue.service';
import { NAVY, CARD_RADIUS } from '@/components/rescue-company/RescueCompanyRequestShared';

interface TrackingVehicleInfoProps {
  request: CustomerRescueRequest;
}

export const TrackingVehicleInfo = ({ request }: TrackingVehicleInfoProps) => {
  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        borderRadius: CARD_RADIUS,
        background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
        color: '#fff',
      }}
    >
      <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, lineHeight: 1.25, color: '#fff' }}>
        Thông tin xe
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TruckIcon sx={{ fontSize: 20, color: '#fff' }} />
          <Typography sx={{ fontSize: 14, lineHeight: 1.3, color: '#fff' }}>
            {request.vehicle?.vehicle_type || 'Xe cứu hộ'}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, color: '#fff' }}>
          {request.vehicle?.plate_number || 'Chưa có biển số'}
        </Typography>
      </Box>
    </Box>
  );
};
