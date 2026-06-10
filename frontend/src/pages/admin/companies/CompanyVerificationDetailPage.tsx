import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  ApartmentOutlined as CompanyIcon,
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  MailOutline as MailIcon,
  LocationOnOutlined as LocationIcon,
  MapOutlined as AreaIcon,
  DescriptionOutlined as LicenseIcon,
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
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { adminService } from '@/services/admin.service';
import { Company } from '@/types/common.type';
import { ORANGE } from '@/constants/colors';
import { SERVICE_AREAS } from '@/constants/service-areas';

export default function CompanyVerificationDetailPage() {
  const navigate = useNavigate();
  const { companyId } = useParams<{ companyId: string }>();
  const location = useLocation();

  const [company, setCompany] = useState<Company | null>((location.state as { company?: Company })?.company || null);
  const [loading, setLoading] = useState(!company);
  const [actionLoading, setActionLoading] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);

  // Dialog states
  const [dialogConfig, setDialogConfig] = useState<{
    open: boolean;
    type: 'reject' | 'request_docs';
    title: string;
    placeholder: string;
  }>({
    open: false,
    type: 'reject',
    title: '',
    placeholder: '',
  });

  useEffect(() => {
    if (!company && companyId) {
      fetchCompanyFromPending();
    }
  }, [companyId]);

  const fetchCompanyFromPending = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingCompanies();
      if (response.status === 'success') {
        const found = response.data.find((c) => c._id === companyId);
        if (found) {
          setCompany(found);
        } else {
          toast.error('Không tìm thấy thông tin công ty hoặc hồ sơ đã được xử lý');
          navigate('/admin/companies/pending', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error fetching company detail:', error);
      toast.error('Không thể tải thông tin chi tiết công ty');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!companyId) return;

    try {
      setActionLoading(true);
      const response = await adminService.approveCompany(companyId);
      if (response.status === 'success') {
        toast.success('Đã phê duyệt hoạt động thành công');
        setOpenApproveDialog(false);
        if (location.key !== 'default') {
          navigate(-1);
        } else {
          navigate('/admin/companies/pending', { replace: true });
        }
      }
    } catch (error: any) {
      console.error('Error approving company:', error);
      toast.error(error.response?.data?.message || 'Phê duyệt thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenActionDialog = (type: 'reject' | 'request_docs') => {
    setDialogConfig({
      open: true,
      type,
      title: type === 'reject' ? 'Từ chối hồ sơ' : 'Yêu cầu bổ sung giấy tờ',
      placeholder:
        type === 'reject'
          ? 'Nhập lý do từ chối cụ thể để gửi cho công ty...'
          : 'Mô tả thông tin/giấy tờ cần bổ sung...',
    });
  };

  const handleDialogConfirm = async (reason: string) => {
    if (!companyId) return;

    try {
      setActionLoading(true);
      let response;
      if (dialogConfig.type === 'reject') {
        response = await adminService.rejectCompany(companyId, reason);
      } else {
        response = await adminService.requestDocuments(companyId, reason);
      }

      if (response.status === 'success') {
        toast.success(
          dialogConfig.type === 'reject' ? 'Đã từ chối hồ sơ thành công' : 'Đã gửi yêu cầu bổ sung giấy tờ thành công'
        );
        setDialogConfig((prev) => ({ ...prev, open: false }));
        if (location.key !== 'default') {
          navigate(-1);
        } else {
          navigate('/admin/companies/pending', { replace: true });
        }
      }
    } catch (error: any) {
      console.error('Error processing verification action:', error);
      toast.error(error.response?.data?.message || 'Xử lý thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <AppHeader title="Chi tiết hồ sơ" backFallback="/admin/companies/pending" />
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </MobileLayout>
    );
  }

  if (!company) return null;

  const hasLicense = !!(company.license_file_url || company.license_url);

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết hồ sơ" backFallback="/admin/companies/pending" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <InfoCard title="Thông tin cơ bản">
          <InfoRow icon={<CompanyIcon />} label="Tên công ty" value={company.company_name} />
          <InfoRow icon={<PersonIcon />} label="Người đại diện pháp luật" value={company.director_name} />
          <InfoRow icon={<PhoneIcon />} label="Số điện thoại liên hệ" value={company.phone} />
          <InfoRow icon={<MailIcon />} label="Địa chỉ Email" value={company.email} />
        </InfoCard>

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
                border: `1px solid rgba(255, 107, 0, 0.15)`,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s',
                '&:hover': {
                  bgcolor: 'rgba(255, 107, 0, 0.08)',
                },
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

        {/* Admin Action Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 4, pb: 4 }}>
          <PrimaryActionButton onClick={() => setOpenApproveDialog(true)} disabled={actionLoading} variant="navy">
            {actionLoading ? 'Đang duyệt...' : 'Phê duyệt hoạt động'}
          </PrimaryActionButton>

          <PrimaryActionButton
            onClick={() => handleOpenActionDialog('request_docs')}
            disabled={actionLoading}
            variant="outline"
          >
            Yêu cầu bổ sung hồ sơ
          </PrimaryActionButton>

          <PrimaryActionButton
            onClick={() => handleOpenActionDialog('reject')}
            disabled={actionLoading}
            variant="orange"
          >
            Từ chối hồ sơ
          </PrimaryActionButton>
        </Box>
      </Box>

      <ActionReasonDialog
        open={dialogConfig.open}
        title={dialogConfig.title}
        placeholder={dialogConfig.placeholder}
        loading={actionLoading}
        onClose={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
        onConfirm={handleDialogConfirm}
      />

      <ConfirmDialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
        onConfirm={handleApprove}
        title="Phê duyệt hoạt động"
        content="Bạn có chắc chắn muốn phê duyệt hồ sơ công ty này?"
        confirmText="Phê duyệt"
        cancelText="Hủy bỏ"
        confirmColor="secondary"
        loading={actionLoading}
      />
    </MobileLayout>
  );
}
