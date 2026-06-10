import { Box, Typography } from '@mui/material';
import {
  SpeedOutlined as ResponseIcon,
  AccessTimeOutlined as TimeIcon,
  StarBorderOutlined as RatingIcon,
  RateReviewOutlined as ReviewIcon,
} from '@mui/icons-material';
import { NAVY, ORANGE, GREEN, CARD_RADIUS } from '@/constants/colors';

interface DetailedRatingsAvg {
  response_time: number;
  service_quality: number;
  staff_attitude: number;
  pricing: number;
}

interface SummaryData {
  totalRequests: number;
  respondedRequests: number;
  responseRate: number;
  avgResponseTime: number;
  totalReviews: number;
  avgRating: number;
  detailedRatingsAvg?: DetailedRatingsAvg;
}

interface QualitySummaryCardsProps {
  summary: SummaryData;
}

export default function QualitySummaryCards({ summary }: QualitySummaryCardsProps) {
  // Determine color for response rate
  const getRateColor = (rate: number) => {
    if (rate >= 80) return GREEN;
    if (rate >= 50) return ORANGE;
    return '#dc2626';
  };

  // Determine color for rating score
  const getRatingColor = (score: number) => {
    if (score >= 4.0) return GREEN;
    if (score >= 3.0) return ORANGE;
    return '#dc2626';
  };

  const cards = [
    {
      title: 'Tỷ lệ phản hồi',
      value: `${summary.responseRate}%`,
      subtext: `Đã trả lời ${summary.respondedRequests}/${summary.totalRequests} yêu cầu`,
      icon: <ResponseIcon sx={{ fontSize: 24, color: getRateColor(summary.responseRate) }} />,
      bgColor: `${getRateColor(summary.responseRate)}0a`,
      borderColor: `${getRateColor(summary.responseRate)}22`,
      textColor: getRateColor(summary.responseRate),
    },
    {
      title: 'Phản hồi trung bình',
      value: summary.avgResponseTime > 0 ? `${summary.avgResponseTime} phút` : 'N/A',
      subtext: 'Tính từ lúc khách gọi tới khi nhận',
      icon: <TimeIcon sx={{ fontSize: 24, color: NAVY }} />,
      bgColor: 'rgba(27, 58, 93, 0.05)',
      borderColor: 'rgba(27, 58, 93, 0.1)',
      textColor: NAVY,
    },
    {
      title: 'Đánh giá trung bình',
      value: summary.avgRating > 0 ? `${summary.avgRating} ★` : 'N/A',
      subtext: `Dựa trên điểm từ 1 đến 5 sao`,
      icon: <RatingIcon sx={{ fontSize: 24, color: getRatingColor(summary.avgRating) }} />,
      bgColor: `${getRatingColor(summary.avgRating)}0a`,
      borderColor: `${getRatingColor(summary.avgRating)}22`,
      textColor: getRatingColor(summary.avgRating),
    },
    {
      title: 'Lượt đánh giá',
      value: summary.totalReviews.toLocaleString(),
      subtext: 'Tổng số phản hồi bằng văn bản',
      icon: <ReviewIcon sx={{ fontSize: 24, color: ORANGE }} />,
      bgColor: 'rgba(255, 107, 0, 0.05)',
      borderColor: 'rgba(255, 107, 0, 0.1)',
      textColor: ORANGE,
    },
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* 4 KPI Cards Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 1fr', sm: '1fr 1fr 1fr 1fr' },
          gap: 2,
          mb: summary.detailedRatingsAvg ? 3 : 0,
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
              gap: 0.5,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                sx={{
                  fontSize: 11,
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
            <Typography sx={{ fontSize: 10, color: '#6b7280' }}>{card.subtext}</Typography>
          </Box>
        ))}
      </Box>

      {/* Detailed Ratings breakdown (only for single company view) */}
      {summary.detailedRatingsAvg && (
        <Box
          sx={{
            p: 2.5,
            borderRadius: CARD_RADIUS,
            border: '1px solid #e5e7eb',
            bgcolor: '#fff',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 800, color: NAVY, mb: 2 }}>
            Điểm đánh giá theo từng khía cạnh
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
            }}
          >
            {[
              { label: 'Thời gian phản hồi', value: summary.detailedRatingsAvg.response_time },
              { label: 'Chất lượng dịch vụ', value: summary.detailedRatingsAvg.service_quality },
              { label: 'Thái độ phục vụ', value: summary.detailedRatingsAvg.staff_attitude },
              { label: 'Giá cả hợp lý', value: summary.detailedRatingsAvg.pricing },
            ].map((crit, idx) => (
              <Box key={idx}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                  <Typography sx={{ fontSize: 13, color: '#4b5563', fontWeight: 500 }}>{crit.label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 800, color: getRatingColor(crit.value) }}>
                    {crit.value > 0 ? `${crit.value} / 5` : 'Chưa có điểm'}
                  </Typography>
                </Box>
                {/* Horizontal Progress Bar */}
                <Box sx={{ width: '100%', height: 6, bgcolor: '#f3f4f6', borderRadius: '3px', overflow: 'hidden' }}>
                  <Box
                    sx={{
                      width: `${(crit.value / 5) * 100}%`,
                      height: '100%',
                      borderRadius: '3px',
                      bgcolor: getRatingColor(crit.value),
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
