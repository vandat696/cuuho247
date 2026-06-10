import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  ApartmentOutlined as CompanyIcon,
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  MailOutline as MailIcon,
  LocationOnOutlined as LocationIcon,
  MapOutlined as AreaIcon,
  DescriptionOutlined as LicenseIcon,
  HistoryToggleOffOutlined as HistoryIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import {
  InfoCard,
  InfoRow,
  PrimaryActionButton,
  formatAddress,
} from '@/components/rescue-company/RescueCompanyRequestShared';
import { ActionReasonDialog } from '@/components/admin/ActionReasonDialog';
import { CompanyLogHistory } from '@/components/admin/CompanyLogHistory';
import { adminService, AuditLog } from '@/services/admin.service';
import { Company } from '@/types/common.type';
import { NAVY, GREEN, RED, ORANGE } from '@/constants/colors';
import { SERVICE_AREAS } from '@/constants/service-areas';
import { formatDateTime } from '@/utils/format';

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  active: { label: 'HOẠT ĐỘNG', bg: 'rgba(22, 163, 74, 0.04)', text: GREEN },
  locked: { label: 'ĐÃ KHÓA', bg: 'rgba(220, 38, 38, 0.04)', text: RED },
  pending_verification: { label: 'CHỜ DUYỆT', bg: 'rgba(255, 107, 0, 0.04)', text: ORANGE },
  rejected: { label: 'BỊ TỪ CHỐI', bg: 'rgba(107, 114, 128, 0.04)', text: '#6b7280' },
};

export default function CompanyDetailPage() {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();

  const [company, setCompany] = useState<Company | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Dialog configurations
  const [dialogConfig, setDialogConfig] = useState<{
    open: boolean;
    type: 'lock' | 'unlock';
    title: string;
    placeholder: string;
  }>({
    open: false,
    type: 'lock',
    title: '',
    placeholder: '',
  });

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
      toast.error('Không thể tải chi tiết đối tác cứu hộ');
      navigate('/admin/users', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenActionDialog = (type: 'lock' | 'unlock') => {
    setDialogConfig({
      open: true,
      type,
      title: type === 'lock' ? 'Khóa tài khoản đối tác' : 'Mở khóa tài khoản đối tác',
      placeholder:
        type === 'lock'
          ? 'Nhập lý do cụ thể khóa tài khoản này (ví dụ: vi phạm chính sách, thái độ cứu hộ không tốt)...'
          : 'Nhập lý do mở khóa tài khoản này...',
    });
  };

  const handleDialogConfirm = async (reason: string) => {
    if (!companyId) return;

    try {
      setActionLoading(true);
      let response;
      if (dialogConfig.type === 'lock') {
        response = await adminService.lockCompany(companyId, reason);
      } else {
        response = await adminService.unlockCompany(companyId, reason);
      }

      if (response.status === 'success') {
        toast.success(dialogConfig.type === 'lock' ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công');
        setDialogConfig((prev) => ({ ...prev, open: false }));
        await fetchCompanyDetailAndLogs();
      }
    } catch (error: any) {
      console.error('Error processing account action:', error);
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <AppHeader title="Chi tiết đối tác" backFallback="/admin/users" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </MobileLayout>
    );
  }

  if (!company) return null;

  const status = company.status || 'pending_verification';
  const cfg = statusConfig[status] || { label: status, bg: 'rgba(107, 114, 128, 0.04)', text: '#6b7280' };
  const hasLicense = !!(company.license_file_url || company.license_url);

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết đối tác" backFallback="/admin/users" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        {/* Basic Information Card */}
        <InfoCard title="Thông tin cơ bản">
          <InfoRow icon={<CompanyIcon />} label="Tên công ty" value={company.company_name} />
          <InfoRow icon={<PersonIcon />} label="Người đại diện" value={company.director_name} />
          <InfoRow icon={<MailIcon />} label="Địa chỉ Email" value={company.email} />
          <InfoRow icon={<PhoneIcon />} label="Số điện thoại" value={company.phone} />
        </InfoCard>

        {/* Location & Service Area */}
        <InfoCard title="Địa chỉ & Khu vực hoạt động">
          <InfoRow icon={<LocationIcon />} label="Địa chỉ đăng ký" value={formatAddress(company.address)} />
          <InfoRow
            icon={<AreaIcon />}
            label="Khu vực hoạt động"
            value={
              SERVICE_AREAS.find((area) => area.id === company.service_area)?.label ||
              company.service_area ||
              'Chưa đăng ký'
            }
          />
        </InfoCard>

        {/* License File Card */}
        <InfoCard title="Giấy phép kinh doanh/Hồ sơ pháp lý">
          {hasLicense ? (
            <Box
              component="a"
              href={company.license_file_url || company.license_url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: '8px',
                bgcolor: 'rgba(255, 107, 0, 0.04)',
                border: '1px solid rgba(255, 107, 0, 0.15)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                '&:hover': { bgcolor: 'rgba(255, 107, 0, 0.08)' },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '8px',
                  bgcolor: 'rgba(255, 107, 0, 0.1)',
                  color: ORANGE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <LicenseIcon sx={{ fontSize: 28 }} />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#1f2937' }} noWrap>
                  Giấy phép kinh doanh
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#6b7280', mt: 0.5 }}>Nhấn để xem chi tiết</Typography>
              </Box>
            </Box>
          ) : (
            <Typography sx={{ fontSize: 14, color: '#ef4444', fontWeight: 500 }}>
              Công ty chưa tải lên tệp hồ sơ pháp lý.
            </Typography>
          )}
        </InfoCard>

        {/* Status indicator Card */}
        <Box sx={{ mb: 3 }}>
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
              Đăng nhập cuối: {company.last_login_at ? formatDateTime(company.last_login_at as any) : 'Chưa đăng nhập'}
            </Box>
          </Box>
        </Box>

        {/* Rejection / Request docs / Lock Reason details */}
        {status === 'locked' && company.lock_reason && (
          <Box sx={{ mb: 3, p: 2, borderRadius: '8px', bgcolor: 'rgba(220,38,38,0.05)', border: `1px solid ${RED}` }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: RED, mb: 0.5 }}>Lý do khóa tài khoản</Typography>
            <Typography sx={{ fontSize: 13.5, color: '#4b5563', fontStyle: 'italic' }}>
              &ldquo;{company.lock_reason}&rdquo;
            </Typography>
          </Box>
        )}

        {status === 'rejected' && company.rejection_reason && (
          <Box sx={{ mb: 3, p: 2, borderRadius: '8px', bgcolor: 'rgba(220,38,38,0.05)', border: `1px solid ${RED}` }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: RED, mb: 0.5 }}>Lý do từ chối hồ sơ</Typography>
            <Typography sx={{ fontSize: 13.5, color: '#4b5563', fontStyle: 'italic' }}>
              &ldquo;{company.rejection_reason}&rdquo;
            </Typography>
          </Box>
        )}

        {/* Action Lock/Unlock buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 4 }}>
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
              Xem và duyệt hồ sơ đăng ký
            </PrimaryActionButton>
          ) : null}
        </Box>

        {/* History Logs */}
        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 800,
            color: NAVY,
            mb: 2,
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

      {/* Action Dialog */}
      <ActionReasonDialog
        open={dialogConfig.open}
        title={dialogConfig.title}
        placeholder={dialogConfig.placeholder}
        loading={actionLoading}
        onClose={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
        onConfirm={handleDialogConfirm}
      />
    </MobileLayout>
  );
}
