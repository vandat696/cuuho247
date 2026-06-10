import { Box, Typography } from '@mui/material';
import {
  AssessmentOutlined as TotalIcon,
  CheckCircleOutlined as SuccessIcon,
  MonetizationOnOutlined as RevenueIcon,
  PercentOutlined as RateIcon,
} from '@mui/icons-material';
import { NAVY, ORANGE, GREEN, CARD_RADIUS } from '@/constants/colors';

interface SummaryData {
  totalRequests: number;
  completedRequests: number;
  cancelledRequests: number;
  successRate: number;
  totalRevenue: number;
}

interface ReportSummaryCardsProps {
  summary: SummaryData;
}

export default function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  // Format currency in VND
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  // Determine color code for success rate
  const getSuccessRateColor = (rate: number) => {
    if (rate >= 80) return GREEN;
    if (rate >= 50) return ORANGE;
    return '#dc2626'; // red
  };

  const cards = [
    {
      title: 'Tổng số yêu cầu',
      value: summary.totalRequests.toLocaleString(),
      icon: <TotalIcon sx={{ fontSize: 24, color: NAVY }} />,
      bgColor: 'rgba(27, 58, 93, 0.05)',
      borderColor: 'rgba(27, 58, 93, 0.1)',
      textColor: NAVY,
    },
    {
      title: 'Đã hoàn thành',
      value: summary.completedRequests.toLocaleString(),
      icon: <SuccessIcon sx={{ fontSize: 24, color: GREEN }} />,
      bgColor: 'rgba(22, 163, 74, 0.05)',
      borderColor: 'rgba(22, 163, 74, 0.1)',
      textColor: GREEN,
    },
    {
      title: 'Tỷ lệ thành công',
      value: `${summary.successRate}%`,
      icon: <RateIcon sx={{ fontSize: 24, color: getSuccessRateColor(summary.successRate) }} />,
      bgColor: `${getSuccessRateColor(summary.successRate)}0a`, // opacity 10%
      borderColor: `${getSuccessRateColor(summary.successRate)}22`, // opacity 20%
      textColor: getSuccessRateColor(summary.successRate),
    },
    {
      title: 'Tổng doanh thu',
      value: formatCurrency(summary.totalRevenue),
      icon: <RevenueIcon sx={{ fontSize: 24, color: ORANGE }} />,
      bgColor: 'rgba(255, 107, 0, 0.05)',
      borderColor: 'rgba(255, 107, 0, 0.1)',
      textColor: ORANGE,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
        gap: 2,
        mb: 3,
      }}
    >
      {cards.map((card, index) => (
        <Box
          key={index}
          sx={{
            p: 2,
            borderRadius: CARD_RADIUS,
            bgcolor: card.bgColor,
            border: `1px solid ${card.borderColor}`,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: '#4b5563',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              {card.title}
            </Typography>
            <Box sx={{ display: 'flex', p: 0.5, borderRadius: '6px', bgcolor: 'rgba(255,255,255,0.8)' }}>
              {card.icon}
            </Box>
          </Box>
          <Typography sx={{ fontSize: { xs: 18, sm: 20 }, fontWeight: 800, color: card.textColor, mt: 0.5 }}>
            {card.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
