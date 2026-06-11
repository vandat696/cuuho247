import AdminCharts from './AdminCharts';

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
  return <AdminCharts type="activity" timeSeries={timeSeries} />;
}
