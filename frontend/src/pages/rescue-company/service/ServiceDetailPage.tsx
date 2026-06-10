import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { useServiceDetail } from '@/hooks/useServiceDetail';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { CompanyInfoCard } from '@/components/rescue-company/CompanyInfoCard';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';

import toast from 'react-hot-toast';
import {
  BuildRounded as WrenchIcon,
  EditRounded as EditIcon,
  DeleteRounded as DeleteIcon,
  AttachMoneyRounded as DollarIcon,
  CategoryRounded as CategoryIcon,
} from '@mui/icons-material';
import { serviceService } from '@/services/service.service';

export default function ServiceDetailPage() {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const { service, loading, error } = useServiceDetail(serviceId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleEdit = () => {
    if (service) {
      navigate(`/company/services/${service._id}/edit`);
    }
  };

  const confirmDelete = async () => {
    if (!service) return;
    setIsDeleting(true);
    try {
      const response = await serviceService.deleteService(service._id);
      if (response?.status === 'success') {
        toast.success('Xóa dịch vụ thành công!');
        navigate('/company/services');
      } else {
        toast.error(response?.message || 'Xóa dịch vụ thất bại');
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Lỗi không xác định';
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !service) {
    return (
      <MobileLayout>
        <AppHeader title="Chi tiết dịch vụ" backFallback="/company/services" />
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">{error || 'Không tìm thấy dịch vụ'}</Typography>
        </Box>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết dịch vụ" backFallback="/company/services" />

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        <CompanyInfoCard
          company={{
            name: service.name,
          }}
          icon={WrenchIcon}
        />
        <Card variant="default" padding="md" sx={{ border: '1px solid #e0e0e0', boxShadow: 'none' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main', mb: 3 }}>
            Thông tin dịch vụ
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <WrenchIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Tên dịch vụ
                </Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  {service.name}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <CategoryIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Danh mục dịch vụ
                </Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                  {(service.category_id?.name as string) || 'Chưa phân loại'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <DollarIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Giá dịch vụ
                </Typography>
              </Box>
              <Box sx={{ pl: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF7A00' }}>
                  {service.price.toLocaleString()} VNĐ
                </Typography>
              </Box>
            </Box>

            {service.description && (
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Mô tả chi tiết
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                  {service.description}
                </Typography>
              </Box>
            )}
          </Box>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <Button
            variant="primary"
            fullWidth
            onClick={handleEdit}
            startIcon={<EditIcon />}
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              bgcolor: 'secondary.main',
              '&:hover': { bgcolor: '#152943' },
            }}
          >
            Chỉnh sửa dịch vụ
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => setOpenDeleteDialog(true)}
            disabled={isDeleting}
            startIcon={<DeleteIcon />}
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              borderColor: 'error.main',
              color: 'error.main',
              '&:hover': { bgcolor: '#fff5f5', borderColor: 'error.dark' },
            }}
          >
            Xóa dịch vụ
          </Button>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}

      <ConfirmDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Xác nhận xóa"
        content={
          <span>
            Bạn có chắc chắn muốn xóa dịch vụ <strong>{service.name}</strong>? Hành động này không thể hoàn tác.
          </span>
        }
        loading={isDeleting}
      />
    </MobileLayout>
  );
}
