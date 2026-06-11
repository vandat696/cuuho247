import AdminCharts from './AdminCharts';

interface QualityTimeSeriesPoint {
  date: string;
  totalRequests: number;
  responseRate: number;
  avgRating: number;
  reviewCount: number;
}

interface QualityChartsProps {
  timeSeries: QualityTimeSeriesPoint[];
}

export default function QualityCharts({ timeSeries }: QualityChartsProps) {
  return <AdminCharts type="quality" timeSeries={timeSeries} />;
}
