import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/common/Button';
import { MiniMap } from '@/components/location/MiniMap';

interface CompanyData {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  etaMinutes: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

interface ConfirmRequestCardProps {
  incidentTypeName: string;
  description: string;
  locationText: string;
  location: {
    lat: number;
    lng: number;
  } | null;
  phone: string;
  company: CompanyData;
  onConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
}

export function ConfirmRequestCard({
  incidentTypeName,
  description,
  locationText,
  location,
  phone,
  company,
  onConfirm,
  onBack,
  loading = false,
}: ConfirmRequestCardProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);
  const priceText =
    company.minPrice !== null && company.maxPrice !== null
      ? `${formatPrice(company.minPrice)} - ${formatPrice(company.maxPrice)}đ`
      : 'Chưa cập nhật giá';
  const etaText = company.etaMinutes ? `~${company.etaMinutes} phút` : 'Chưa có thời gian dự kiến';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Alert */}
      <Box
        sx={{
          bgcolor: '#fff7ed',
          border: '1px solid #f97316',
          borderRadius: '12px',
          p: 2,
          display: 'flex',
          gap: 1.5,
        }}
      >
        <Box sx={{ color: '#ea580c', mt: 0.25 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        </Box>
        <Box>
          <Typography variant="subtitle2" sx={{ color: '#c2410c', fontWeight: 700, mb: 0.5 }}>
            Vui lòng kiểm tra thông tin
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569' }}>
            Đảm bảo thông tin chính xác trước khi gửi yêu cầu cứu hộ.
          </Typography>
        </Box>
      </Box>

      {/* Incident Info */}
      <Box
        sx={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>
          Thông tin sự cố
        </Typography>

        <Box>
          <Typography sx={{ fontSize: 13, color: '#64748b', mb: 0.5 }}>Loại sự cố</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span style={{ color: '#94a3b8' }}>🔧</span>
            <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{incidentTypeName}</Typography>
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, color: '#64748b', mb: 0.5 }}>Mô tả</Typography>
          <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{description}</Typography>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, color: '#64748b', mb: 0.5 }}>Vị trí</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
              <span style={{ color: '#94a3b8', marginTop: 2 }}>📍</span>
              <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{locationText}</Typography>
            </Box>
            {location ? (
              <MiniMap lat={location.lat} lng={location.lng} zoom={15} />
            ) : (
              <Box
                sx={{
                  p: 2,
                  bgcolor: '#f9fafb',
                  border: '1px dashed #d1d5db',
                  borderRadius: '12px',
                  color: '#6b7280',
                  fontSize: 14,
                  textAlign: 'center',
                }}
              >
                Chưa có tọa độ để hiển thị bản đồ
              </Box>
            )}
          </Box>
        </Box>

        <Box>
          <Typography sx={{ fontSize: 13, color: '#64748b', mb: 0.5 }}>Số điện thoại</Typography>
          <Typography sx={{ fontWeight: 600, color: '#1e293b' }}>{phone}</Typography>
        </Box>
      </Box>

      {/* Company Info */}
      <Box sx={{ border: '1px solid #e2e8f0', borderRadius: '12px', p: 2.5 }}>
        <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 700, color: '#0f172a', mb: 2 }}>
          Công ty cứu hộ
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: '#1e293b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            🏥
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>{company.name}</Typography>
            <Typography sx={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <span style={{ color: '#eab308' }}>★</span> {company.rating} ({company.reviews} đánh giá)
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #cbd5e1', pt: 2, mb: 1.5 }}>
          <Typography sx={{ color: '#64748b', fontSize: 14 }}>Thời gian đến</Typography>
          <Typography sx={{ color: '#ea580c', fontWeight: 600 }}>{etaText}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ color: '#64748b', fontSize: 14 }}>Giá dự kiến</Typography>
          <Typography sx={{ color: '#1e293b', fontWeight: 700 }}>{priceText}</Typography>
        </Box>
      </Box>

      {/* Note */}
      <Box sx={{ bgcolor: '#f0f9ff', p: 2, borderRadius: '12px', border: '1px solid #bae6fd' }}>
        <Typography sx={{ fontSize: 14, color: '#334155' }}>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>Lưu ý:</span> Sau khi xác nhận, công ty cứu hộ sẽ nhận
          được yêu cầu của bạn và liên hệ lại trong thời gian sớm nhất.
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onConfirm}
          loading={loading}
          sx={{ height: 52, fontSize: 16, borderRadius: '12px' }}
        >
          Xác nhận yêu cầu
        </Button>
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={onBack}
          disabled={loading}
          sx={{ height: 52, fontSize: 16, borderRadius: '12px' }}
        >
          Quay lại
        </Button>
      </Box>
    </Box>
  );
}
