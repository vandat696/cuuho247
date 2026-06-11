import { useState } from 'react';
import { toast } from 'react-hot-toast';

export function useAccountStatusActions(
  accountId: string | undefined,
  accountType: 'user' | 'company',
  fetchDetailAndLogs: () => Promise<void>,
  lockApi: (id: string, reason: string) => Promise<any>,
  unlockApi: (id: string, reason: string) => Promise<any>
) {
  const [actionLoading, setActionLoading] = useState(false);
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

  const handleOpenActionDialog = (type: 'lock' | 'unlock') => {
    const targetName = accountType === 'user' ? 'người dùng' : 'công ty cứu hộ';
    const lockPlaceholder =
      accountType === 'user'
        ? 'Nhập lý do cụ thể khóa tài khoản này (ví dụ: vi phạm chính sách, tạo yêu cầu giả)...'
        : 'Nhập lý do cụ thể khóa tài khoản này (ví dụ: vi phạm chính sách, thái độ cứu hộ không tốt)...';

    setDialogConfig({
      open: true,
      type,
      title: type === 'lock' ? `Khóa tài khoản ${targetName}` : `Mở khóa tài khoản ${targetName}`,
      placeholder: type === 'lock' ? lockPlaceholder : 'Nhập lý do mở khóa tài khoản này...',
    });
  };

  const handleDialogConfirm = async (reason: string) => {
    if (!accountId) return;

    try {
      setActionLoading(true);
      const response =
        dialogConfig.type === 'lock' ? await lockApi(accountId, reason) : await unlockApi(accountId, reason);

      if (response.status === 'success') {
        toast.success(dialogConfig.type === 'lock' ? 'Khóa tài khoản thành công' : 'Mở khóa tài khoản thành công');
        setDialogConfig((prev) => ({ ...prev, open: false }));
        await fetchDetailAndLogs();
      }
    } catch (error: any) {
      console.error('Error processing account action:', error);
      toast.error(error.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setActionLoading(false);
    }
  };

  return {
    actionLoading,
    dialogConfig,
    setDialogConfig,
    handleOpenActionDialog,
    handleDialogConfirm,
  };
}
