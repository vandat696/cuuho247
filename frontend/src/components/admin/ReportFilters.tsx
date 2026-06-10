import { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { NAVY, CARD_RADIUS } from '@/constants/colors';

interface FilterState {
  startDate: string;
  endDate: string;
  serviceCategoryId: string;
  groupBy: 'day' | 'week' | 'month';
}

interface ReportFiltersProps {
  filters: FilterState;
  categories: { _id: string; name: string }[];
  onApply: (newFilters: FilterState) => void;
  loading: boolean;
}

export default function ReportFilters({ filters: initialFilters, categories, onApply, loading }: ReportFiltersProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [error, setError] = useState<string | null>(null);

  // Sync state if initialFilters changes
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const validateDates = (startStr: string, endStr: string): string | null => {
    if (!startStr || !endStr) return 'Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc';

    const start = new Date(startStr);
    const end = new Date(endStr);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Định dạng ngày không hợp lệ';
    }

    if (start > end) {
      return 'Ngày bắt đầu không được lớn hơn ngày kết thúc';
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 366) {
      return 'Khoảng thời gian vượt quá giới hạn cho phép (366 ngày)';
    }

    return null;
  };

  const handleFieldChange = (key: keyof FilterState, value: any) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);

    // Auto validate inline when dates change
    if (key === 'startDate' || key === 'endDate') {
      const err = validateDates(updated.startDate, updated.endDate);
      setError(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateDates(filters.startDate, filters.endDate);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onApply(filters);
  };

  const selectCategoriesOptions = [
    { id: 'all', label: 'Tất cả dịch vụ' },
    ...categories.map((c) => ({ id: c._id, label: c.name })),
  ];

  const groupByOptions = [
    { id: 'day', label: 'Theo ngày' },
    { id: 'week', label: 'Theo tuần' },
    { id: 'month', label: 'Theo tháng' },
  ];

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: CARD_RADIUS,
        border: '1px solid #e5e7eb',
        bgcolor: '#f9fafb',
      }}
    >
      <Typography
        sx={{ fontSize: 15, fontWeight: 800, color: NAVY, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <FilterIcon sx={{ fontSize: 20 }} />
        Bộ lọc báo cáo
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Input
            label="Từ ngày"
            type="date"
            required
            value={filters.startDate}
            onChange={(e) => handleFieldChange('startDate', e.target.value)}
          />

          <Input
            label="Đến ngày"
            type="date"
            required
            value={filters.endDate}
            onChange={(e) => handleFieldChange('endDate', e.target.value)}
          />
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
          <Select
            label="Loại dịch vụ"
            value={filters.serviceCategoryId === 'all' ? '' : filters.serviceCategoryId}
            onChange={(e) => handleFieldChange('serviceCategoryId', e.target.value || 'all')}
            options={selectCategoriesOptions}
            placeholder="Tất cả dịch vụ"
          />

          <Select
            label="Hiển thị theo"
            value={filters.groupBy}
            onChange={(e) => handleFieldChange('groupBy', e.target.value as any)}
            options={groupByOptions}
          />
        </Box>

        {error && <Typography sx={{ color: '#dc2626', fontSize: 13, fontWeight: 500 }}>{error}</Typography>}

        <Button
          type="submit"
          variant="contained"
          disabled={loading || !!error}
          sx={{
            py: 1.25,
            bgcolor: NAVY,
            color: '#fff',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': { bgcolor: '#112233' },
          }}
        >
          {loading ? 'Đang tải dữ liệu...' : 'Áp dụng bộ lọc'}
        </Button>
      </Box>
    </Box>
  );
}
