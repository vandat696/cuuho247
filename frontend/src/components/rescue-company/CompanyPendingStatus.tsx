import { Box, Typography } from '@mui/material';
import {
  HourglassEmptyRounded as PendingIcon,
  ErrorOutlineRounded as RejectedIcon,
  LockOutlined as LockedIcon,
  LogoutRounded as LogoutIcon,
  EditOutlined as EditIcon,
} from '@mui/icons-material';

import { Company } from '@/types/common.type';
import { NAVY, CARD_RADIUS } from '@/constants/colors';

interface CompanyPendingStatusProps {
  company: Company | null;
  handleLogout: () => void;
  onEditProfile: () => void;
}

export const CompanyPendingStatus = ({ company, handleLogout, onEditProfile }: CompanyPendingStatusProps) => {
  const isRejected = company?.status === 'rejected';
  const isPending = company?.status === 'pending_verification';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Status Panel */}
      <Box
        sx={{
          textAlign: 'center',
          py: 4,
          px: 2,
          borderRadius: CARD_RADIUS,
          border: '1.5px dashed',
          bgcolor: isRejected ? 'rgba(239, 68, 68, 0.04)' : 'rgba(255, 107, 0, 0.04)',
          borderColor: isRejected ? 'error.main' : 'primary.main',
          mb: 4,
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: isRejected ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 107, 0, 0.1)',
            color: isRejected ? 'error.main' : 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          {isRejected ? (
            <RejectedIcon sx={{ fontSize: 36 }} />
          ) : isPending ? (
            <PendingIcon sx={{ fontSize: 36 }} />
          ) : (
            <LockedIcon sx={{ fontSize: 36 }} />
          )}
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
          {isRejected ? 'Hồ sơ xác thực bị từ chối' : isPending ? 'Hồ sơ đang chờ duyệt' : 'Tài khoản chưa hoạt động'}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary', px: 1, lineHeight: 1.5 }}>
          {isRejected
            ? 'Rất tiếc, hồ sơ pháp lý của công ty đã bị từ chối bởi ban quản trị hệ thống. Vui lòng cập nhật lại hồ sơ hoặc liên hệ hỗ trợ kỹ thuật để biết thêm thông tin.'
            : isPending
              ? 'Thông tin đăng ký của bạn đang được kiểm tra bởi Ban quản trị Cuuho247. Vui lòng đợi trong khi chúng tôi xác minh tính hợp lệ của hồ sơ.'
              : 'Tài khoản công ty chưa được phê duyệt hoạt động bởi ban quản trị.'}
        </Typography>

        {/* Show admin rejection reason */}
        {isRejected && company?.rejection_reason && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: '8px',
              bgcolor: 'rgba(239, 68, 68, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              textAlign: 'left',
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: '#dc2626',
                mb: 0.5,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Lý do từ chối
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#7f1d1d', lineHeight: 1.5 }}>{company.rejection_reason}</Typography>
          </Box>
        )}

        {/* Show admin document request reason */}
        {isPending && company?.document_request_reason && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: '8px',
              bgcolor: 'rgba(255, 107, 0, 0.06)',
              border: '1px solid rgba(255, 107, 0, 0.2)',
              textAlign: 'left',
            }}
          >
            <Typography
              sx={{
                fontSize: 11,
                fontWeight: 700,
                color: '#ff6b00',
                mb: 0.5,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
              }}
            >
              Yêu cầu bổ sung từ quản trị viên
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#7c2d12', lineHeight: 1.5 }}>
              {company.document_request_reason}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Profile Overview Card */}
      <Box sx={{ border: '2px solid #e5e7eb', borderRadius: CARD_RADIUS, p: 2.5, mb: 4 }}>
        <Typography sx={{ fontWeight: 800, color: NAVY, fontSize: 16, mb: 2 }}>Thông tin đăng ký</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box>
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Tên đơn vị</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 700, mt: 0.25 }}>{company?.company_name}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Người đại diện</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 500, mt: 0.25 }}>{company?.director_name}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Số điện thoại</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 500, mt: 0.25 }}>{company?.phone}</Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: 12, color: '#6b7280' }}>Email đăng ký</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 500, mt: 0.25 }}>{company?.email}</Typography>
          </Box>
        </Box>
      </Box>

      {/* Actions Stack */}
      <Box
        sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5, pt: 2, borderTop: '1px solid #e5e7eb' }}
      >
        {/* Edit Profile Button (only allowed if pending or rejected status) */}
        {(isPending || isRejected) && (
          <Box
            component="button"
            type="button"
            onClick={onEditProfile}
            sx={{
              width: '100%',
              p: 2,
              borderRadius: CARD_RADIUS,
              bgcolor: NAVY,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              fontSize: 16,
              fontWeight: 700,
              transition: 'background 0.15s, transform 0.1s',
              border: 'none',
              '&:hover': { bgcolor: '#2a5082' },
              '&:active': { transform: 'scale(0.99)' },
              cursor: 'pointer',
            }}
          >
            <EditIcon sx={{ fontSize: 22 }} />
            Cập nhật lại hồ sơ
          </Box>
        )}

        {/* Logout Button */}
        <Box
          component="button"
          type="button"
          onClick={handleLogout}
          sx={{
            width: '100%',
            p: 2,
            border: '2px solid #fee2e2',
            borderRadius: CARD_RADIUS,
            bgcolor: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: '#dc2626',
            fontSize: 16,
            fontWeight: 700,
            transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
            '&:hover': { bgcolor: '#fff5f5', borderColor: '#fecaca' },
            '&:active': { transform: 'scale(0.99)' },
            cursor: 'pointer',
          }}
        >
          <LogoutIcon sx={{ fontSize: 22 }} />
          Đăng xuất
        </Box>
      </Box>
    </Box>
  );
};
