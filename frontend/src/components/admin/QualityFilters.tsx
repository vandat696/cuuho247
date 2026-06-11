import AdminFilters from './AdminFilters';

interface FilterState {
  startDate: string;
  endDate: string;
  companyId: string;
  groupBy: 'day' | 'week' | 'month';
}

interface QualityFiltersProps {
  filters: FilterState;
  companies: { _id: string; company_name: string }[];
  onApply: (newFilters: FilterState) => void;
  loading: boolean;
}

export default function QualityFilters({ filters, companies, onApply, loading }: QualityFiltersProps) {
  return (
    <AdminFilters title="Bộ lọc thống kê" filters={filters} companies={companies} onApply={onApply} loading={loading} />
  );
}
