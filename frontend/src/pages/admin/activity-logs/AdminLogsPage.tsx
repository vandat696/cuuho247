import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';

import { AdminLayout } from '@/components/layout/AdminLayout';
import { AuditLogItem } from '@/components/admin/AuditLogItem';
import { adminService, AuditLog } from '@/services/admin.service';
import { Button } from '@/components/common/Button';
import { NAVY } from '@/constants/colors';

const PAGE_SIZE = 15;

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    fetchLogs(0, false);
  }, []);

  const fetchLogs = async (currentSkip: number, loadMore: boolean) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await adminService.getAuditLogs(PAGE_SIZE, currentSkip);
      if (response.status === 'success') {
        const rawData = response.data as any;
        let newLogs: AuditLog[] = [];
        let newTotal = 0;

        if (rawData && Array.isArray(rawData.logs)) {
          newLogs = rawData.logs;
          newTotal = rawData.total ?? 0;
        } else if (Array.isArray(rawData)) {
          newLogs = rawData;
          newTotal = (response as any).total ?? newLogs.length;
        }

        if (loadMore) {
          setLogs((prev) => [...(prev || []), ...newLogs]);
        } else {
          setLogs(newLogs);
        }
        setTotal(newTotal);
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Không thể tải nhật ký hoạt động');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextSkip = skip + PAGE_SIZE;
    setSkip(nextSkip);
    fetchLogs(nextSkip, true);
  };

  const hasMore = (logs || []).length < total;

  return (
    <AdminLayout title="Nhật ký hệ thống" backFallback="/admin/home">
      <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>
        Tổng số: {total} hành động ghi nhận
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (logs || []).length === 0 ? (
        <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
          <Typography sx={{ fontSize: 14 }}>Không tìm thấy nhật ký hoạt động nào.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pb: 4 }}>
          {(logs || []).map((log) => (
            <AuditLogItem key={log._id} log={log} />
          ))}

          {hasMore && (
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: 200 }}>
                <Button variant="outline" fullWidth onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? 'Đang tải thêm...' : 'Xem thêm'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </AdminLayout>
  );
}
