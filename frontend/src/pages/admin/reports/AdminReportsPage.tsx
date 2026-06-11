import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Alert } from '@mui/material';
import { DownloadOutlined as ExportIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { adminService, RescueActivitiesReport } from '@/services/admin.service';
import { http } from '@/services/http';
import { NAVY, BUTTON_RADIUS } from '@/constants/colors';
import { getDefaultDateRange } from '@/utils/date';

import ReportFilters from '@/components/admin/ReportFilters';
import ReportSummaryCards from '@/components/admin/ReportSummaryCards';
import ReportCharts from '@/components/admin/ReportCharts';
import ReportServiceStats from '@/components/admin/ReportServiceStats';

interface FilterState {
  startDate: string;
  endDate: string;
  serviceCategoryId: string;
  groupBy: 'day' | 'week' | 'month';
}

export default function AdminReportsPage() {
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [reportData, setReportData] = useState<RescueActivitiesReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    ...getDefaultDateRange(6),
    serviceCategoryId: 'all',
    groupBy: 'day',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await http.get('/service-categories');
      if (response.data?.status === 'success') {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Không thể tải danh mục dịch vụ');
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {
        startDate: filters.startDate,
        endDate: filters.endDate,
        groupBy: filters.groupBy,
      };

      if (filters.serviceCategoryId !== 'all') {
        params.serviceCategoryId = filters.serviceCategoryId;
      }

      const response = await adminService.getRescueActivitiesReport(params);
      if (response.status === 'success') {
        setReportData(response.data);
      } else {
        setError(response.message || 'Không thể lấy dữ liệu báo cáo');
      }
    } catch (err: any) {
      console.error('Error fetching report:', err);
      const errMsg = err.response?.data?.message || 'Lỗi truy vấn dữ liệu báo cáo';
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleExportCSV = () => {
    if (!reportData) return;

    let csvContent = '\uFEFF'; // UTF-8 BOM so Vietnamese displays correctly in Excel

    // Header Info
    csvContent += 'BÁO CÁO HOẠT ĐỘNG CỨU HỘ\n';
    csvContent += `Thời gian: từ ${filters.startDate} đến ${filters.endDate}\n`;
    const selectedCategoryName =
      filters.serviceCategoryId === 'all'
        ? 'Tất cả dịch vụ'
        : categories.find((c) => c._id === filters.serviceCategoryId)?.name || 'Dịch vụ đã chọn';
    csvContent += `Lọc theo dịch vụ: ${selectedCategoryName}\n`;
    csvContent += `Tần suất hiển thị: ${filters.groupBy === 'day' ? 'Theo ngày' : filters.groupBy === 'week' ? 'Theo tuần' : 'Theo tháng'}\n\n`;

    // 1. Overall metrics
    csvContent += 'CHỈ SỐ TỔNG QUAN\n';
    csvContent += 'Chỉ số,Giá trị\n';
    csvContent += `Tổng yêu cầu cứu hộ,${reportData.summary.totalRequests}\n`;
    csvContent += `Số yêu cầu hoàn thành,${reportData.summary.completedRequests}\n`;
    csvContent += `Số yêu cầu bị hủy/lỗi,${reportData.summary.cancelledRequests}\n`;
    csvContent += `Tỷ lệ thành công,${reportData.summary.successRate}%\n`;
    csvContent += `Tổng doanh thu (VND),${reportData.summary.totalRevenue}\n\n`;

    // 2. Service type breakdown
    csvContent += 'PHÂN LOẠI DỊCH VỤ\n';
    csvContent += 'Dịch vụ,Số lượng yêu cầu,Tỷ lệ (%)\n';
    reportData.serviceTypeStats.forEach((stat) => {
      csvContent += `"${stat.name}",${stat.count},${stat.percentage}%\n`;
    });
    csvContent += '\n';

    // 3. Status breakdown
    csvContent += 'THỐNG KÊ TRẠNG THÁI YÊU CẦU\n';
    csvContent += 'Trạng thái,Số lượng\n';
    const statusLabels: Record<string, string> = {
      completed: 'Đã hoàn thành',
      pending: 'Chờ nhận',
      accepted: 'Đã nhận',
      in_progress: 'Đang cứu hộ',
      arrived: 'Đã tiếp cận',
      cancelled: 'Hủy bỏ',
      rejected: 'Từ chối',
      timeout: 'Hết hạn',
    };
    reportData.statusStats.forEach((stat) => {
      csvContent += `${statusLabels[stat.status] || stat.status},${stat.count}\n`;
    });
    csvContent += '\n';

    // 4. Time series trend
    csvContent += 'TẦN SUẤT SỬ DỤNG DỊCH VỤ THEO THỜI GIAN\n';
    csvContent += 'Mốc thời gian,Tổng yêu cầu,Hoàn thành,Bị hủy/Lỗi\n';
    reportData.timeSeries.forEach((point) => {
      csvContent += `${point.date},${point.count},${point.completed},${point.cancelled}\n`;
    });

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bao_cao_hoat_dong_cuu_ho_${filters.startDate}_to_${filters.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Xuất file báo cáo CSV thành công');
  };

  const hasData = reportData && reportData.summary.totalRequests > 0;

  return (
    <>
      {/* Filters */}
      <ReportFilters
        filters={filters}
        categories={categories}
        onApply={handleApplyFilters}
        loading={loading || loadingCategories}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : !reportData ? (
        <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
          <Typography>Không có dữ liệu báo cáo.</Typography>
        </Box>
      ) : (
        <>
          {/* KPI Cards */}
          <ReportSummaryCards summary={reportData.summary} />

          {!hasData ? (
            // Empty State
            <Box
              sx={{
                py: 6,
                px: 3,
                textAlign: 'center',
                bgcolor: '#f9fafb',
                borderRadius: 2,
                border: '1px dashed #d1d5db',
              }}
            >
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#4b5563', mb: 1 }}>Không có dữ liệu</Typography>
              <Typography sx={{ fontSize: 13, color: '#6b7280' }}>
                Không tìm thấy yêu cầu cứu hộ nào trong khoảng thời gian và tiêu chí đã chọn.
              </Typography>
            </Box>
          ) : (
            // Active Report View
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Export Data Bar */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleExportCSV}
                  startIcon={<ExportIcon />}
                  sx={{
                    borderColor: NAVY,
                    color: NAVY,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: BUTTON_RADIUS,
                    '&:hover': {
                      bgcolor: 'rgba(27, 58, 93, 0.05)',
                      borderColor: NAVY,
                    },
                  }}
                >
                  Xuất báo cáo (CSV)
                </Button>
              </Box>

              {/* SVG Time Series Charts */}
              <ReportCharts timeSeries={reportData.timeSeries} />

              {/* Service Types Breakdown */}
              <Box sx={{ pb: 4 }}>
                <ReportServiceStats stats={reportData.serviceTypeStats} />
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
}
