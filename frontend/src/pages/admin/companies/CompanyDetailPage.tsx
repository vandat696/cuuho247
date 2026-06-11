import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { HistoryToggleOffOutlined as HistoryIcon } from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { PrimaryActionButton } from '@/components/rescue-company/RescueCompanyRequestShared';
import { ActionReasonDialog } from '@/components/admin/ActionReasonDialog';
import { CompanyLogHistory } from '@/components/admin/CompanyLogHistory';
import CompanyDetailsSection from '@/components/admin/CompanyDetailsSection';
import { useAccountStatusActions } from '@/hooks/useAccountStatusActions';
import { adminService, AuditLog } from '@/services/admin.service';
import { Company } from '@/types/common.type';
import { NAVY, GREEN, RED } from '@/constants/colors';
import { formatDateTime } from '@/utils/format';

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'HOẠT ĐỘNG', bg: 'rgba(22, 163, 74, 0.04)', text: GREEN },
  locked: { label: 'ĐÃ KHÓA', bg: 'rgba(220, 38, 38, 0.04)', text: RED },
  pending_verification: { label: 'CHỜ DUYỆT', bg: 'rgba(255, 107, 0, 0.04)', text: '#ff6b00' },
  rejected: { label: 'BỊ TỪ CHỐI', bg: 'rgba(107, 114, 128, 0.04)', text: '#6b7280' },
};

export default function CompanyDetailPage() {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();

  const [company, setCompany] = useState<Company | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (companyId) {
      fetchCompanyDetailAndLogs();
    }
  }, [companyId]);

  const fetchCompanyDetailAndLogs = async () => {
    try {
      setLoading(true);
      if (!companyId) return;

      const [companyRes, logsRes] = await Promise.all([
        adminService.getCompanyDetail(companyId),
        adminService.getCompanyLogs(companyId),
      ]);

      if (companyRes.status === 'success') {
        setCompany(companyRes.data);
      }
      if (logsRes.status === 'success') {
        setLogs(logsRes.data);
      }
    } catch (error) {
      console.error('Error fetching company detail:', error);
      toast.error('Không thể tải chi tiết công ty cứu hộ');
      navigate('/admin/users', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const { actionLoading, dialogConfig, setDialogConfig, handleOpenActionDialog, handleDialogConfirm } =
    useAccountStatusActions(
      companyId,
      'company',
      fetchCompanyDetailAndLogs,
      adminService.lockCompany,
      adminService.unlockCompany
    );

  if (loading) {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!company) return null;

  const status = company.status || 'pending_verification';
  const cfg = statusConfig[status] || { label: status, bg: 'rgba(107, 114, 128, 0.04)', text: '#6b7280' };

  return (
    <>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Basic Details & Business Profile */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <CompanyDetailsSection company={company} />

          {/* Status indicator Card */}
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: NAVY, mb: 1 }}>Trạng thái hiện tại</Typography>
            <Box
              sx={{
                p: 2,
                borderRadius: '8px',
                bgcolor: cfg.bg,
                border: `1px solid ${cfg.text}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: cfg.text }}>{cfg.label}</Typography>

              <Box component="span" sx={{ fontSize: 13, color: '#6b7280' }}>
                Đăng nhập cuối:{' '}
                {company.last_login_at ? formatDateTime(company.last_login_at as any) : 'Chưa đăng nhập'}
              </Box>
            </Box>
          </Box>

          {/* Rejection / Request docs / Lock Reason details */}
          {status === 'locked' && company.lock_reason && (
            <Box sx={{ p: 2, borderRadius: '8px', bgcolor: 'rgba(220,38,38,0.05)', border: `1px solid ${RED}` }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: RED, mb: 0.5 }}>Lý do khóa tài khoản</Typography>
              <Typography sx={{ fontSize: 13.5, color: '#4b5563', fontStyle: 'italic' }}>
                &ldquo;{company.lock_reason}&rdquo;
              </Typography>
            </Box>
          )}

          {status === 'rejected' && company.rejection_reason && (
            <Box sx={{ p: 2, borderRadius: '8px', bgcolor: 'rgba(220,38,38,0.05)', border: `1px solid ${RED}` }}>
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: RED, mb: 0.5 }}>Lý do từ chối hồ sơ</Typography>
              <Typography sx={{ fontSize: 13.5, color: '#4b5563', fontStyle: 'italic' }}>
                &ldquo;{company.rejection_reason}&rdquo;
              </Typography>
            </Box>
          )}

          {/* Action Lock/Unlock buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {status === 'locked' ? (
              <PrimaryActionButton
                onClick={() => handleOpenActionDialog('unlock')}
                disabled={actionLoading}
                variant="navy"
              >
                {actionLoading ? 'Đang xử lý...' : 'Mở khóa tài khoản'}
              </PrimaryActionButton>
            ) : status === 'active' ? (
              <PrimaryActionButton
                onClick={() => handleOpenActionDialog('lock')}
                disabled={actionLoading}
                variant="orange"
              >
                {actionLoading ? 'Đang xử lý...' : 'Khóa tài khoản'}
              </PrimaryActionButton>
            ) : status === 'pending_verification' ? (
              <PrimaryActionButton onClick={() => navigate(`/admin/companies/${company._id}/verify`)} variant="navy">
                Xem và duyệt hồ sơ đăng ký công ty cứu hộ
              </PrimaryActionButton>
            ) : null}
          </Box>
        </Box>

        {/* Right Column: Change logs history timeline */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 800,
              color: NAVY,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <HistoryIcon sx={{ fontSize: 20 }} />
            Lịch sử thay đổi trạng thái
          </Typography>

          <Box sx={{ pb: 4 }}>
            <CompanyLogHistory logs={logs} />
          </Box>
        </Box>
      </Box>

      {/* Action Dialog */}
      <ActionReasonDialog
        open={dialogConfig.open}
        title={dialogConfig.title}
        placeholder={dialogConfig.placeholder}
        loading={actionLoading}
        onClose={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
        onConfirm={handleDialogConfirm}
      />
    </>
  );
}
