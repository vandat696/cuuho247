import { Box, Typography } from '@mui/material';
import { NAVY, CARD_RADIUS } from '@/constants/colors';

interface StatusStat {
  status: string;
  count: number;
}

interface ReportStatusStatsProps {
  stats: StatusStat[];
  totalRequests: number;
}

const STATUS_MAP: Record<string, { label: string; color: string; bgColor: string }> = {
  completed: { label: 'Đã hoàn thành', color: '#16a34a', bgColor: '#f0fdf4' },
  pending: { label: 'Chờ nhận', color: '#d97706', bgColor: '#fef3c7' },
  accepted: { label: 'Đã nhận', color: '#2563eb', bgColor: '#dbeafe' },
  in_progress: { label: 'Đang cứu hộ', color: '#0891b2', bgColor: '#ecfeff' },
  arrived: { label: 'Đã tiếp cận', color: '#0d9488', bgColor: '#ccfbf1' },
  cancelled: { label: 'Hủy bỏ', color: '#dc2626', bgColor: '#fee2e2' },
  rejected: { label: 'Từ chối', color: '#b91c1c', bgColor: '#fecaca' },
  timeout: { label: 'Hết hạn', color: '#4b5563', bgColor: '#f3f4f6' },
  unknown: { label: 'Khác', color: '#6b7280', bgColor: '#f9fafb' },
};

export default function ReportStatusStats({ stats, totalRequests }: ReportStatusStatsProps) {
  // Sort stats: completed first, then in progress, then pending, then others
  const sortedStats = [...stats].sort((a, b) => {
    const order = ['completed', 'in_progress', 'arrived', 'accepted', 'pending', 'cancelled', 'rejected', 'timeout'];
    const idxA = order.indexOf(a.status);
    const idxB = order.indexOf(b.status);
    const valA = idxA === -1 ? 99 : idxA;
    const valB = idxB === -1 ? 99 : idxB;
    return valA - valB;
  });

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
      <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, mb: 2 }}>Trạng thái yêu cầu</Typography>

      {sortedStats.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: '#6b7280', py: 2, textAlign: 'center' }}>
          Không có dữ liệu trạng thái.
        </Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          {sortedStats.map((item) => {
            const statusConfig = STATUS_MAP[item.status] || STATUS_MAP.unknown;
            const percentage = totalRequests > 0 ? Math.round((item.count / totalRequests) * 1000) / 10 : 0;

            return (
              <Box
                key={item.status}
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  border: '1px solid #f3f4f6',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '6px',
                      bgcolor: statusConfig.bgColor,
                      color: statusConfig.color,
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {statusConfig.label}
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: NAVY }}>{item.count}</Typography>
                  <Typography sx={{ fontSize: 11, color: '#6b7280' }}>{percentage}%</Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
