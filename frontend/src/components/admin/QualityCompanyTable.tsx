import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { NAVY, CARD_RADIUS } from '@/constants/colors';

interface CompanyQualityBreakdown {
  companyId: string;
  companyName: string;
  totalRequests: number;
  responseRate: number;
  avgResponseTime: number;
  avgRating: number;
  reviewCount: number;
}

interface QualityCompanyTableProps {
  breakdown: CompanyQualityBreakdown[];
}

export default function QualityCompanyTable({ breakdown }: QualityCompanyTableProps) {
  const getRankBadge = (idx: number) => {
    if (idx === 0) return '🥇';
    if (idx === 1) return '🥈';
    if (idx === 2) return '🥉';
    return `${idx + 1}`;
  };

  const getRatingColor = (score: number) => {
    if (score >= 4.0) return '#16a34a'; // green
    if (score >= 3.0) return '#ea580c'; // orange
    if (score > 0) return '#dc2626'; // red
    return '#6b7280'; // gray
  };

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
      <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, mb: 2 }}>
        Bảng so sánh chất lượng các công ty cứu hộ
      </Typography>

      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}
      >
        <Table sx={{ minWidth: 600 }}>
          <TableHead sx={{ bgcolor: '#f9fafb' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: NAVY, width: 60, textAlign: 'center' }}>Hạng</TableCell>
              <TableCell sx={{ fontWeight: 700, color: NAVY }}>Tên công ty cứu hộ</TableCell>
              <TableCell sx={{ fontWeight: 700, color: NAVY, textAlign: 'center' }}>Số yêu cầu</TableCell>
              <TableCell sx={{ fontWeight: 700, color: NAVY, textAlign: 'center' }}>Tỷ lệ phản hồi</TableCell>
              <TableCell sx={{ fontWeight: 700, color: NAVY, textAlign: 'center' }}>Phản hồi TB</TableCell>
              <TableCell sx={{ fontWeight: 700, color: NAVY, textAlign: 'center' }}>Điểm đánh giá</TableCell>
              <TableCell sx={{ fontWeight: 700, color: NAVY, textAlign: 'center' }}>Lượt đánh giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {breakdown.map((row, idx) => (
              <TableRow
                key={row.companyId}
                sx={{
                  '&:last-child transform td, &:last-child th': { border: 0 },
                  bgcolor: idx < 3 ? 'rgba(255, 184, 0, 0.02)' : 'inherit',
                  '&:hover': { bgcolor: '#f9fafb' },
                }}
              >
                <TableCell sx={{ textAlign: 'center', fontWeight: idx < 3 ? 700 : 500, fontSize: 14 }}>
                  {getRankBadge(idx)}
                </TableCell>
                <TableCell sx={{ fontWeight: 700, fontSize: 13, color: '#374151' }}>{row.companyName}</TableCell>
                <TableCell sx={{ textAlign: 'center', fontSize: 13 }}>{row.totalRequests}</TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center',
                    fontWeight: 600,
                    color: row.responseRate >= 80 ? '#16a34a' : row.responseRate >= 50 ? '#ea580c' : '#dc2626',
                    fontSize: 13,
                  }}
                >
                  {row.responseRate}%
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontSize: 13 }}>
                  {row.avgResponseTime > 0 ? `${row.avgResponseTime}m` : 'N/A'}
                </TableCell>
                <TableCell
                  sx={{ textAlign: 'center', fontWeight: 700, color: getRatingColor(row.avgRating), fontSize: 13 }}
                >
                  {row.avgRating > 0 ? `${row.avgRating} ★` : 'Chưa có'}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontSize: 13, color: '#6b7280' }}>{row.reviewCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
