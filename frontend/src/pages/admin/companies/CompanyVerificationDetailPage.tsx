import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import {
  ApartmentOutlined as CompanyIcon,
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  MailOutline as MailIcon,
  LocationOnOutlined as LocationIcon,
  DescriptionOutlined as LicenseIcon,
  VerifiedUserOutlined as VerifyIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { AdminLayout } from '@/components/layout/AdminLayout';
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
import { NAVY, ORANGE } from '@/constants/colors';

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
          toast.error('Không tìm thấy thông tin công ty cứu hộ hoặc hồ sơ đã được xử lý');
          navigate('/admin/companies/pending', { replace: true });
        }
      }
    } catch (error) {
      console.error('Error fetching company detail:', error);
      toast.error('Không thể tải thông tin chi tiết công ty cứu hộ');
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
      title: type === 'reject' ? 'Từ chối hồ sơ công ty cứu hộ' : 'Yêu cầu chỉnh sửa giấy tờ',
      placeholder:
        type === 'reject'
          ? 'Nhập lý do từ chối cụ thể để gửi cho công ty cứu hộ...'
          : 'Mô tả thông tin/giấy tờ cần chỉnh sửa gửi cho công ty cứu hộ...',
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
          dialogConfig.type === 'reject' ? 'Đã từ chối hồ sơ thành công' : 'Đã gửi yêu cầu chỉnh sửa hồ sơ thành công'
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
      <AdminLayout title="Duyệt hồ sơ công ty cứu hộ" backFallback="/admin/companies/pending" showBack={true}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!company) return null;

  const hasLicense = !!(company.license_file_url || company.license_url);

  return (
    <AdminLayout title="Duyệt hồ sơ công ty cứu hộ" backFallback="/admin/companies/pending" showBack={true}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        {/* Left Column: Business Profile Details */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Basic Information Card */}
          <InfoCard title="Thông tin cơ bản">
            <InfoRow icon={<CompanyIcon />} label="Tên công ty cứu hộ" value={company.company_name} />
            <InfoRow icon={<PersonIcon />} label="Người đại diện pháp luật" value={company.director_name} />
            <InfoRow icon={<PhoneIcon />} label="Số điện thoại liên hệ" value={company.phone} />
            <InfoRow icon={<MailIcon />} label="Địa chỉ Email" value={company.email} />
          </InfoCard>

          {/* Location */}
          <InfoCard title="Địa chỉ đăng ký">
            <InfoRow icon={<LocationIcon />} label="Địa chỉ đăng ký" value={formatAddress(company.address)} />
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
                Công ty cứu hộ chưa tải lên tệp hồ sơ pháp lý.
              </Typography>
            )}
          </InfoCard>
        </Box>

        {/* Right Column: Verification Action Panel */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: '12px',
              bgcolor: '#fff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            }}
          >
            <Typography
              sx={{
                fontSize: 16,
                fontWeight: 800,
                color: NAVY,
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <VerifyIcon sx={{ fontSize: 22, color: NAVY }} />
              Quyết định kiểm duyệt
            </Typography>

            <Typography sx={{ fontSize: 13.5, color: '#4b5563', mb: 3, lineHeight: 1.5 }}>
              Vui lòng rà soát kỹ các thông tin pháp lý, giấy phép hoạt động và số điện thoại liên hệ của công ty cứu hộ
              trước khi đưa ra quyết định duyệt.
            </Typography>

            {/* Admin Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <PrimaryActionButton onClick={() => setOpenApproveDialog(true)} disabled={actionLoading} variant="navy">
                {actionLoading ? 'Đang duyệt...' : 'Phê duyệt hoạt động'}
              </PrimaryActionButton>

              <PrimaryActionButton
                onClick={() => handleOpenActionDialog('request_docs')}
                disabled={actionLoading}
                variant="outline"
              >
                Yêu cầu chỉnh sửa hồ sơ
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
        </Box>
      </Box>

      {/* Rejection / Docs requests Dialog */}
      <ActionReasonDialog
        open={dialogConfig.open}
        title={dialogConfig.title}
        placeholder={dialogConfig.placeholder}
        loading={actionLoading}
        onClose={() => setDialogConfig((prev) => ({ ...prev, open: false }))}
        onConfirm={handleDialogConfirm}
      />

      {/* Approve Confirm Dialog */}
      <ConfirmDialog
        open={openApproveDialog}
        onClose={() => setOpenApproveDialog(false)}
        onConfirm={handleApprove}
        title="Phê duyệt hoạt động"
        content="Bạn có chắc chắn muốn phê duyệt hồ sơ công ty cứu hộ này?"
        confirmText="Phê duyệt"
        cancelText="Hủy bỏ"
        confirmColor="secondary"
        loading={actionLoading}
      />
    </AdminLayout>
  );
}
