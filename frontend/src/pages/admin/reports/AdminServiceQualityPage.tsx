import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button, Alert } from '@mui/material';
import { DownloadOutlined as ExportIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { adminService, ServiceQualityReport } from '@/services/admin.service';
import { NAVY, BUTTON_RADIUS } from '@/constants/colors';

import QualityFilters from '@/components/admin/QualityFilters';
import QualitySummaryCards from '@/components/admin/QualitySummaryCards';
import QualityCharts from '@/components/admin/QualityCharts';
import QualityCompanyTable from '@/components/admin/QualityCompanyTable';

interface FilterState {
  startDate: string;
  endDate: string;
  companyId: string;
  groupBy: 'day' | 'week' | 'month';
}

export default function AdminServiceQualityPage() {
  const [companies, setCompanies] = useState<{ _id: string; company_name: string }[]>([]);
  const [reportData, setReportData] = useState<ServiceQualityReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize dates to last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 6);

  const formatDateString = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [filters, setFilters] = useState<FilterState>({
    startDate: formatDateString(sevenDaysAgo),
    endDate: formatDateString(today),
    companyId: 'all',
    groupBy: 'day',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const response = await adminService.getAllCompaniesForFilter();
      if (response.status === 'success') {
        setCompanies(response.data);
      }
    } catch (err) {
      console.error('Error fetching companies list:', err);
      toast.error('Không thể tải danh sách công ty cứu hộ');
    } finally {
      setLoadingCompanies(false);
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

      if (filters.companyId !== 'all') {
        params.companyId = filters.companyId;
      }

      const response = await adminService.getServiceQualityReport(params);
      if (response.status === 'success') {
        setReportData(response.data);
      } else {
        setError(response.message || 'Không thể lấy dữ liệu thống kê');
      }
    } catch (err: any) {
      console.error('Error fetching quality report:', err);
      const errMsg = err.response?.data?.message || 'Lỗi truy vấn dữ liệu báo cáo chất lượng';
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

    let csvContent = '\uFEFF'; // UTF-8 BOM so Excel opens Vietnamese characters correctly

    // Header Info
    csvContent += 'BÁO CÁO THỐNG KÊ CHẤT LƯỢNG DỊCH VỤ\n';
    csvContent += `Thời gian: từ ${filters.startDate} đến ${filters.endDate}\n`;
    const selectedCompanyName =
      filters.companyId === 'all'
        ? 'Tất cả công ty cứu hộ'
        : companies.find((c) => c._id === filters.companyId)?.company_name || 'Công ty cứu hộ đã chọn';
    csvContent += `Công ty cứu hộ: ${selectedCompanyName}\n`;
    csvContent += `Hiển thị theo: ${filters.groupBy === 'day' ? 'Theo ngày' : filters.groupBy === 'week' ? 'Theo tuần' : 'Theo tháng'}\n\n`;

    // 1. Overall stats
    csvContent += 'CHỈ SỐ THỐNG KÊ TỔNG QUAN\n';
    csvContent += 'Chỉ số,Giá trị\n';
    csvContent += `Tổng số yêu cầu cứu hộ,${reportData.summary.totalRequests}\n`;
    csvContent += `Số yêu cầu đã trả lời,${reportData.summary.respondedRequests}\n`;
    csvContent += `Tỷ lệ phản hồi (%),${reportData.summary.responseRate}%\n`;
    csvContent += `Thời gian phản hồi TB (phút),${reportData.summary.avgResponseTime > 0 ? reportData.summary.avgResponseTime : 'N/A'}\n`;
    csvContent += `Tổng số đánh giá,${reportData.summary.totalReviews}\n`;
    csvContent += `Điểm hài lòng trung bình,${reportData.summary.avgRating > 0 ? reportData.summary.avgRating : 'N/A'}\n\n`;

    // 2. Detailed rating aspects if company is selected
    if (reportData.summary.detailedRatingsAvg) {
      csvContent += 'ĐIỂM ĐÁNH GIÁ CHI TIẾT (THANG ĐIỂM 5)\n';
      csvContent += 'Khía cạnh,Điểm trung bình\n';
      csvContent += `Thời gian phản hồi,${reportData.summary.detailedRatingsAvg.response_time}\n`;
      csvContent += `Chất lượng dịch vụ,${reportData.summary.detailedRatingsAvg.service_quality}\n`;
      csvContent += `Thái độ phục vụ,${reportData.summary.detailedRatingsAvg.staff_attitude}\n`;
      csvContent += `Giá cả hợp lý,${reportData.summary.detailedRatingsAvg.pricing}\n\n`;
    }

    // 3. System time series trend
    csvContent += 'XU HƯỚNG THEO THỜI GIAN\n';
    csvContent += 'Mốc thời gian,Tổng yêu cầu,Tỷ lệ phản hồi (%),Điểm hài lòng TB (1-5)\n';
    reportData.timeSeries.forEach((point) => {
      csvContent += `${point.date},${point.totalRequests},${point.responseRate}%,${point.avgRating > 0 ? point.avgRating : 0}\n`;
    });
    csvContent += '\n';

    // 4. Company Rank breakdown if "All Companies" selected
    if (filters.companyId === 'all' && reportData.companyBreakdown) {
      csvContent += 'BẢNG XẾP HẠNG CHẤT LƯỢNG CÁC CÔNG TY CỨU HỘ\n';
      csvContent +=
        'Xếp hạng,Tên công ty cứu hộ,Tổng yêu cầu,Tỷ lệ phản hồi (%),Phản hồi trung bình (m),Điểm đánh giá trung bình,Lượt đánh giá\n';
      reportData.companyBreakdown.forEach((row, index) => {
        csvContent += `${index + 1},"${row.companyName}",${row.totalRequests},${row.responseRate}%,${row.avgResponseTime > 0 ? row.avgResponseTime : 'N/A'},${row.avgRating > 0 ? row.avgRating : 'N/A'},${row.reviewCount}\n`;
      });
    }

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `thong_ke_chat_luong_dich_vu_${filters.startDate}_to_${filters.endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Xuất file thống kê chất lượng thành công');
  };

  const hasData = reportData && (reportData.summary.totalRequests > 0 || reportData.summary.totalReviews > 0);

  return (
    <AdminLayout title="Chất lượng dịch vụ" backFallback="/admin/home">
      {/* Filter component */}
      <QualityFilters
        filters={filters}
        companies={companies}
        onApply={handleApplyFilters}
        loading={loading || loadingCompanies}
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
          <Typography>Không có dữ liệu thống kê.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* KPI Summary cards */}
          <QualitySummaryCards summary={reportData.summary} />

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
                Không tìm thấy hoạt động cứu hộ hay lượt đánh giá nào trong tiêu chí lọc đã chọn.
              </Typography>
            </Box>
          ) : (
            // Active data displays
            <>
              {/* Export Data Button */}
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

              {/* SVG Trend line charts */}
              <QualityCharts timeSeries={reportData.timeSeries} />

              {/* Company Rank comparison table (only if viewing all companies) */}
              {filters.companyId === 'all' && reportData.companyBreakdown && (
                <QualityCompanyTable breakdown={reportData.companyBreakdown} />
              )}
            </>
          )}
        </Box>
      )}
    </AdminLayout>
  );
}
