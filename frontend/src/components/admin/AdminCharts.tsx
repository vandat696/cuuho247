import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { NAVY, ORANGE, GREEN, RED, CARD_RADIUS } from '@/constants/colors';

export interface QualityTimeSeriesPoint {
  date: string;
  totalRequests: number;
  responseRate: number;
  avgRating: number;
  reviewCount: number;
}

export interface ActivityTimeSeriesPoint {
  date: string;
  count: number;
  completed: number;
  cancelled: number;
}

interface AdminChartsProps {
  type: 'quality' | 'activity';
  timeSeries: any[];
}

export default function AdminCharts({ type, timeSeries }: AdminChartsProps) {
  const [activeTab, setActiveTab] = useState(0); // 0 = Rating trend, 1 = Response rate trend
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!timeSeries || timeSeries.length === 0) {
    return null;
  }

  const isQuality = type === 'quality';

  // Dimension settings
  const width = 600;
  const height = isQuality ? 240 : 280;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = isQuality ? 25 : 30;
  const paddingBottom = isQuality ? 35 : 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Quality settings
  const isRating = isQuality && activeTab === 0;
  const yMax = isQuality ? (isRating ? 5 : 100) : Math.max(...timeSeries.map((d) => d.count), 5);
  const yTicks = isQuality
    ? isRating
      ? [1, 2, 3, 4, 5]
      : [0, 25, 50, 75, 100]
    : Array.from({ length: 5 }, (_, i) => Math.round((yMax / 4) * i));

  const step = timeSeries.length > 1 ? chartWidth / (timeSeries.length - 1) : chartWidth;

  // Width configurations for bars
  const barWidth = isQuality ? Math.max(4, Math.min(24, step * 0.4)) : Math.max(2, Math.min(12, step * 0.24));
  const barGap = isQuality ? 0 : Math.max(1, barWidth * 0.15);

  const getCoords = (idx: number, value: number) => {
    const innerPadding = isQuality ? Math.max(16, barWidth * 1.5) : Math.max(16, barWidth * 2.5);
    const availableWidth = chartWidth - 2 * innerPadding;
    const x = paddingLeft + innerPadding + (idx / (timeSeries.length - 1 || 1)) * availableWidth;
    const y = paddingTop + chartHeight - (value / yMax) * chartHeight;
    return { x, y };
  };

  const formatDateLabel = (dateStr: string) => {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`;
    }
    return dateStr;
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
      {isQuality ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Biểu đồ xu hướng</Typography>
          <Tabs
            value={activeTab}
            onChange={(_, val) => {
              setActiveTab(val);
              setHoveredIdx(null);
            }}
            indicatorColor="secondary"
            textColor="secondary"
            sx={{
              '& .MuiTab-root': { fontWeight: 700, fontSize: 12, py: 1, minHeight: 0 },
            }}
          >
            <Tab label="Mức độ hài lòng (Rating)" />
            <Tab label="Tỷ lệ phản hồi (%)" />
          </Tabs>
        </Box>
      ) : (
        <>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, mb: 1 }}>Biểu đồ hoạt động cứu hộ</Typography>
          <Typography sx={{ fontSize: 12, color: '#6b7280', mb: 3 }}>
            Biểu thị tổng số cuộc gọi (cột màu xanh đậm), số ca thành công (cột màu xanh lá) và số ca bị hủy (cột màu
            đỏ)
          </Typography>
        </>
      )}

      <Box sx={{ position: 'relative', width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="auto" style={{ overflow: 'visible' }}>
          {/* Grids */}
          {yTicks.map((tick, i) => {
            const y = paddingTop + chartHeight - (tick / yMax) * chartHeight;
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#f3f4f6"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#9ca3af"
                  style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif' }}
                >
                  {tick}
                  {isQuality && !isRating ? '%' : ''}
                </text>
              </g>
            );
          })}

          {/* X Axis labels */}
          {timeSeries.map((p, idx) => {
            const { x } = getCoords(idx, 0);
            const showLabel =
              timeSeries.length < 12 ||
              (timeSeries.length < 25 && idx % 2 === 0) ||
              idx % 5 === 0 ||
              idx === timeSeries.length - 1;

            if (!showLabel) return null;

            return (
              <text
                key={idx}
                x={x}
                y={paddingTop + chartHeight + 18}
                textAnchor="middle"
                fill="#9ca3af"
                style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif' }}
              >
                {formatDateLabel(p.date)}
              </text>
            );
          })}

          {/* Subtle hover background highlight */}
          {timeSeries.map((_, idx) => {
            const { x } = getCoords(idx, 0);
            const isHovered = hoveredIdx === idx;
            if (!isHovered) return null;

            return (
              <rect
                key={`hover-${idx}`}
                x={isQuality ? x - barWidth - 4 : x - 1.5 * barWidth - barGap - 4}
                y={paddingTop - 4}
                width={isQuality ? 2 * barWidth + 8 : 3 * barWidth + 2 * barGap + 8}
                height={chartHeight + 8}
                fill="rgba(27, 58, 93, 0.04)"
                rx={4}
              />
            );
          })}

          {/* Bar Charts */}
          {timeSeries.map((p, idx) => {
            const { x, y: yZero } = getCoords(idx, 0);
            const isHovered = hoveredIdx === idx;
            const opacityVal = isHovered ? 1.0 : 0.85;

            if (isQuality) {
              const val = isRating ? p.avgRating : p.responseRate;
              const h = (val / yMax) * chartHeight;
              const y = yZero - h;

              if (h <= 0) return null;

              return (
                <rect
                  key={idx}
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={h}
                  fill={isRating ? ORANGE : NAVY}
                  opacity={opacityVal}
                  rx={2}
                />
              );
            } else {
              // Total bar (Blue)
              const hTotal = (p.count / yMax) * chartHeight;
              const yTotal = yZero - hTotal;

              // Completed bar (Green)
              const hCompleted = (p.completed / yMax) * chartHeight;
              const yCompleted = yZero - hCompleted;

              // Cancelled bar (Red)
              const hCancelled = (p.cancelled / yMax) * chartHeight;
              const yCancelled = yZero - hCancelled;

              return (
                <g key={idx}>
                  {hTotal > 0 && (
                    <rect
                      x={x - 1.5 * barWidth - barGap}
                      y={yTotal}
                      width={barWidth}
                      height={hTotal}
                      fill={NAVY}
                      opacity={opacityVal}
                      rx={1.5}
                    />
                  )}
                  {hCompleted > 0 && (
                    <rect
                      x={x - 0.5 * barWidth}
                      y={yCompleted}
                      width={barWidth}
                      height={hCompleted}
                      fill={GREEN}
                      opacity={opacityVal}
                      rx={1.5}
                    />
                  )}
                  {hCancelled > 0 && (
                    <rect
                      x={x + 0.5 * barWidth + barGap}
                      y={yCancelled}
                      width={barWidth}
                      height={hCancelled}
                      fill={RED}
                      opacity={opacityVal}
                      rx={1.5}
                    />
                  )}
                </g>
              );
            }
          })}

          {/* Transparent interaction zones */}
          {timeSeries.map((_, idx) => {
            const { x } = getCoords(idx, 0);
            const hoverWidth = chartWidth / (timeSeries.length - 1 || 1);
            return (
              <rect
                key={idx}
                x={x - hoverWidth / 2}
                y={paddingTop}
                width={hoverWidth}
                height={chartHeight}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Hover Tooltip overlay */}
        {hoveredIdx !== null && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              left:
                getCoords(hoveredIdx, 0).x > width / 2
                  ? `${(getCoords(hoveredIdx, 0).x / width) * 100 - 32}%`
                  : `${(getCoords(hoveredIdx, 0).x / width) * 100 + 4}%`,
              bgcolor: 'rgba(27, 58, 93, 0.95)',
              color: '#fff',
              px: 1.5,
              py: 1.25,
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              zIndex: 10,
              pointerEvents: 'none',
              minWidth: '140px',
              transition: 'left 0.1s ease',
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                opacity: 0.9,
                borderBottom: '1px solid rgba(255,255,255,0.2)',
                pb: 0.5,
                mb: 0.5,
                color: '#fff',
              }}
            >
              Mốc: {timeSeries[hoveredIdx].date}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
              {isQuality ? (
                isRating ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontSize: 11, color: '#fff' }}>Điểm số:</Typography>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                        {timeSeries[hoveredIdx].avgRating > 0 ? `${timeSeries[hoveredIdx].avgRating} ★` : 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontSize: 11, color: '#fff' }}>Lượt đánh giá:</Typography>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                        {timeSeries[hoveredIdx].reviewCount}
                      </Typography>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontSize: 11, color: '#fff' }}>Tỷ lệ phản hồi:</Typography>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                        {timeSeries[hoveredIdx].responseRate}%
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography sx={{ fontSize: 11, color: '#fff' }}>Tổng yêu cầu:</Typography>
                      <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                        {timeSeries[hoveredIdx].totalRequests}
                      </Typography>
                    </Box>
                  </>
                )
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography sx={{ fontSize: 11, color: '#fff' }}>Yêu cầu:</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                      {timeSeries[hoveredIdx].count}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, color: '#4ade80' }}>
                    <Typography sx={{ fontSize: 11, color: '#4ade80' }}>Thành công:</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#4ade80' }}>
                      {timeSeries[hoveredIdx].completed}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, color: '#f87171' }}>
                    <Typography sx={{ fontSize: 11, color: '#f87171' }}>Bị hủy/Lỗi:</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#f87171' }}>
                      {timeSeries[hoveredIdx].cancelled}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
