import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CompanyResult } from '@/types/rescue.type';
import StarIcon from '@mui/icons-material/Star';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';

interface CompanyCardProps {
  company: CompanyResult;
  onViewDetail?: (company: CompanyResult) => void;
}

export function CompanyCard({ company, onViewDetail }: CompanyCardProps) {
  const formatPrice = (price: number | null) => (price === null ? null : new Intl.NumberFormat('vi-VN').format(price));
  const priceText =
    company.min_price !== null && company.max_price !== null
      ? `${formatPrice(company.min_price)} - ${formatPrice(company.max_price)}đ`
      : 'Chưa cập nhật giá';
  const etaText = company.eta_minutes ? `~${company.eta_minutes} phút` : 'Chưa có ETA';

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: '16px',
        border: '1.5px solid #e2e8f0',
        p: 2.5,
        mb: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
      }}
    >
      {/* Header: Name and Distance */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1e3a5f',
            flex: 1,
            pr: 2,
          }}
        >
          {company.company_name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: '#1e3a5f' }}>
          <LocationOnIcon sx={{ fontSize: 18, mr: 0.5 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{company.distance_km} km</Typography>
        </Box>
      </Box>

      {/* Rating Row */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <StarIcon sx={{ color: '#ffb400', fontSize: 20, mr: 0.5 }} />
        <Typography sx={{ fontWeight: 700, fontSize: 15, mr: 1, color: '#1e3a5f' }}>{company.rating_avg}</Typography>
        <Typography sx={{ color: '#718096', fontSize: 14 }}>({company.rating_count} đánh giá)</Typography>
      </Box>

      {/* Price and Time Info */}
      <Box sx={{ display: 'flex', gap: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <PaidIcon sx={{ color: '#a0aec0', fontSize: 20, mr: 1, mt: 0.2 }} />
          <Typography sx={{ fontSize: 15, color: '#1e3a5f', fontWeight: 500, lineHeight: 1.2 }}>{priceText}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTimeIcon sx={{ color: '#a0aec0', fontSize: 20, mr: 1 }} />
          <Typography sx={{ fontSize: 15, color: '#1e3a5f', fontWeight: 500 }}>{etaText}</Typography>
        </Box>
      </Box>

      {/* Action Button */}
      <Box
        component="button"
        onClick={() => onViewDetail?.(company)}
        sx={{
          width: '100%',
          height: 52,
          bgcolor: '#ff6b00',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: 16,
          fontWeight: 700,
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            bgcolor: '#e05a00',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
      >
        Xem chi tiết
      </Box>
    </Box>
  );
}
