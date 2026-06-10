import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { NAVY, GREEN, RED, CARD_RADIUS } from '@/constants/colors';

interface TimeSeriesPoint {
  date: string;
  count: number;
  completed: number;
  cancelled: number;
}

interface ReportChartsProps {
  timeSeries: TimeSeriesPoint[];
}

export default function ReportCharts({ timeSeries }: ReportChartsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!timeSeries || timeSeries.length === 0) {
    return null;
  }

  // Dimension settings
  const width = 600;
  const height = 280;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate scales
  const maxVal = Math.max(...timeSeries.map((d) => d.count), 5);
  const yTicksCount = 5;
  const yTicks = Array.from({ length: yTicksCount }, (_, i) => Math.round((maxVal / (yTicksCount - 1)) * i));

  // Calculate width for columns
  const step = timeSeries.length > 1 ? chartWidth / (timeSeries.length - 1) : chartWidth;
  const barWidth = Math.max(2, Math.min(12, step * 0.24));
  const barGap = Math.max(1, barWidth * 0.15);

  // Function to get Coordinates
  const getCoords = (idx: number, value: number) => {
    const innerPadding = Math.max(16, barWidth * 2.5);
    const availableWidth = chartWidth - 2 * innerPadding;
    const x = paddingLeft + innerPadding + (idx / (timeSeries.length - 1 || 1)) * availableWidth;
    const y = paddingTop + chartHeight - (value / maxVal) * chartHeight;
    return { x, y };
  };

  // Format date display
  const formatDateLabel = (dateStr: string) => {
    // If YYYY-MM-DD
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}`; // DD/MM
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
      <Typography sx={{ fontSize: 16, fontWeight: 800, color: NAVY, mb: 1 }}>Biểu đồ hoạt động cứu hộ</Typography>
      <Typography sx={{ fontSize: 12, color: '#6b7280', mb: 3 }}>
        Biểu thị tổng số cuộc gọi (cột màu xanh đậm), số ca thành công (cột màu xanh lá) và số ca bị hủy (cột màu đỏ)
      </Typography>

      <Box sx={{ position: 'relative', width: '100%' }}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="auto" style={{ overflow: 'visible' }}>
          {/* Grids */}
          {yTicks.map((tick, i) => {
            const y = paddingTop + chartHeight - (tick / maxVal) * chartHeight;
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
                </text>
              </g>
            );
          })}

          {/* X Axis labels */}
          {timeSeries.map((p, idx) => {
            const { x } = getCoords(idx, 0);
            // Show every label if length < 10, or every 2nd if < 20, or every 5th otherwise
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
                x={x - 1.5 * barWidth - barGap - 4}
                y={paddingTop - 4}
                width={3 * barWidth + 2 * barGap + 8}
                height={chartHeight + 8}
                fill="rgba(27, 58, 93, 0.04)"
                rx={4}
              />
            );
          })}

          {/* Bar charts (Total, Completed, Cancelled side-by-side) */}
          {timeSeries.map((p, idx) => {
            const { x, y: yZero } = getCoords(idx, 0);

            // Total bar (Blue)
            const hTotal = (p.count / maxVal) * chartHeight;
            const yTotal = yZero - hTotal;

            // Completed bar (Green)
            const hCompleted = (p.completed / maxVal) * chartHeight;
            const yCompleted = yZero - hCompleted;

            // Cancelled bar (Red)
            const hCancelled = (p.cancelled / maxVal) * chartHeight;
            const yCancelled = yZero - hCancelled;

            const isHovered = hoveredIdx === idx;
            const opacityVal = isHovered ? 1.0 : 0.85;

            return (
              <g key={idx}>
                {/* Total requests bar */}
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
                {/* Completed requests bar */}
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
                {/* Cancelled requests bar */}
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
          })}

          {/* Invisible interactive columns for easy hover */}
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

        {/* Floating Tooltip Box */}
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
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
