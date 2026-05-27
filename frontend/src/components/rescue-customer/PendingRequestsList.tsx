import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Button } from '@/components/common/Button';

export interface PendingRequest {
  _id: string;
  incidentType: string;
  companyName: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'in_progress';
  locationText: string;
}

interface PendingRequestsListProps {
  requests: PendingRequest[];
  onCancel: (id: string) => void;
  cancellingId: string | null;
}

export function PendingRequestsList({ requests, onCancel, cancellingId }: PendingRequestsListProps) {
  if (requests.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
        <Typography sx={{ color: '#64748b' }}>Bạn không có yêu cầu cứu hộ nào đang chờ xử lý.</Typography>
      </Box>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Đang chờ xác nhận', color: '#f59e0b', bg: '#fef3c7' };
      case 'accepted':
        return { text: 'Công ty đã nhận', color: '#3b82f6', bg: '#dbeafe' };
      case 'in_progress':
        return { text: 'Đang xử lý', color: '#10b981', bg: '#d1fae5' };
      default:
        return { text: status, color: '#64748b', bg: '#f1f5f9' };
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {requests.map((req) => {
        const statusConfig = getStatusText(req.status);
        const canCancel = req.status === 'pending' || req.status === 'accepted';

        return (
          <Box
            key={req._id}
            sx={{
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              p: 2,
              bgcolor: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography sx={{ fontWeight: 700, color: '#0f172a', fontSize: 16 }}>
                  {req.incidentType || 'Yêu cầu cứu hộ'}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#64748b', mt: 0.5 }}>
                  {new Date(req.createdAt).toLocaleString('vi-VN')}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '999px',
                  bgcolor: statusConfig.bg,
                  color: statusConfig.color,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {statusConfig.text}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
              <Typography sx={{ fontSize: 14, color: '#334155' }}>
                <span style={{ color: '#64748b' }}>Công ty:</span>{' '}
                <span style={{ fontWeight: 600 }}>{req.companyName}</span>
              </Typography>
              <Typography sx={{ fontSize: 14, color: '#334155' }}>
                <span style={{ color: '#64748b' }}>Vị trí:</span> {req.locationText}
              </Typography>
            </Box>

            {canCancel && (
              <Box sx={{ mt: 1, pt: 2, borderTop: '1px dashed #e2e8f0' }}>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => onCancel(req._id)}
                  loading={cancellingId === req._id}
                  sx={{
                    color: '#ef4444',
                    borderColor: '#fee2e2',
                    '&:hover': { bgcolor: '#fef2f2', borderColor: '#fca5a5' },
                  }}
                >
                  Hủy yêu cầu
                </Button>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
