import AdminFilters from './AdminFilters';

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

export default function ReportFilters({ filters, categories, onApply, loading }: ReportFiltersProps) {
  return (
    <AdminFilters
      title="Bộ lọc báo cáo"
      filters={filters}
      categories={categories}
      onApply={onApply}
      loading={loading}
    />
  );
}
