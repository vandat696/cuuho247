import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AccessTimeOutlined,
  GroupsOutlined,
  HistoryOutlined,
  LocationOnOutlined,
  NotificationsNoneRounded,
  PersonOutlineOutlined,
  PhoneOutlined,
  SecurityOutlined,
} from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';

import { MobileLayout } from '@/components/layout/MobileLayout';

const NAVY = '#1B3A5D';
const ORANGE = '#FF6B00';
const CARD_RADIUS = '12px';
const USER_NAME = 'Nguyễn Văn An';

function CustomerHeader() {
  return (
    <Box
      component="header"
      sx={{
        bgcolor: NAVY,
        color: '#fff',
        px: 2,
        py: 2,
        minHeight: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
        <SecurityOutlined sx={{ fontSize: 24, flexShrink: 0 }} />
        <Typography sx={{ fontSize: 18, fontWeight: 800, color: '#fff', lineHeight: 1.25 }} noWrap>
          Cứu hộ 247
        </Typography>
      </Box>

      <IconButton aria-label="Thông báo" size="small" sx={{ p: 1, color: '#fff' }}>
        <NotificationsNoneRounded sx={{ fontSize: 24 }} />
      </IconButton>
    </Box>
  );
}

function PrimaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="contained"
      fullWidth
      onClick={onClick}
      sx={{
        minHeight: 48,
        borderRadius: '8px',
        bgcolor: ORANGE,
        color: '#fff',
        fontSize: 16,
        fontWeight: 700,
        boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.28)',
        '&:hover': { bgcolor: '#ff8533', boxShadow: '0 10px 15px -3px rgba(255, 107, 0, 0.34)' },
      }}
    >
      {children}
    </Button>
  );
}

function RescueInfoRow({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 18, color: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 12, color: '#6b7280', lineHeight: 1.25 }}>{label}</Typography>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: accent ? ORANGE : NAVY, lineHeight: 1.35 }} noWrap>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function QuickAction({ icon, label, onClick }: { icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        minHeight: 104,
        p: 2,
        bgcolor: '#fff',
        border: '2px solid #e5e7eb',
        borderRadius: CARD_RADIUS,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        color: NAVY,
        transition: 'background 0.15s, border-color 0.15s, transform 0.1s',
        '&:hover': { bgcolor: '#F5F7FA', borderColor: '#d1d5db' },
        '&:active': { transform: 'scale(0.98)' },
      }}
    >
      {icon}
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: '#374151', lineHeight: 1.25 }}>{label}</Typography>
    </Box>
  );
}

export default function CustomerHomePage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <CustomerHeader />

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff', px: 3, py: 3 }}>
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: CARD_RADIUS,
            background: `linear-gradient(90deg, ${NAVY} 0%, #2a5082 100%)`,
            color: '#fff',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '9999px',
                bgcolor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <PersonOutlineOutlined sx={{ fontSize: 34 }} />
            </Box>
            <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#fff', lineHeight: 1.25 }} noWrap>
              {USER_NAME}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: CARD_RADIUS,
            bgcolor: 'rgba(255, 107, 0, 0.1)',
            border: `2px solid ${ORANGE}`,
          }}
        >
          <Typography sx={{ mb: 1.5, fontSize: 16, fontWeight: 800, color: ORANGE }}>Cứu hộ đang thực hiện</Typography>

          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <RescueInfoRow
              icon={<LocationOnOutlined sx={{ fontSize: 18 }} />}
              label="Trạng thái hiện tại"
              value="Xe đang di chuyển"
            />
            <RescueInfoRow
              icon={<SecurityOutlined sx={{ fontSize: 18 }} />}
              label="Công ty cứu hộ"
              value="Cứu hộ Minh Anh"
            />
            <RescueInfoRow
              icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />}
              label="Thời gian dự kiến đến"
              value="~8 phút"
              accent
            />
          </Box>

          <PrimaryButton onClick={() => navigate('/rescue/search')}>Theo dõi cứu hộ</PrimaryButton>
        </Box>

        <Box sx={{ mb: 3 }}>
          <PrimaryButton onClick={() => navigate('/rescue/request')}>
            <PhoneOutlined sx={{ mr: 1, fontSize: 22 }} />
            Gửi yêu cầu cứu hộ
          </PrimaryButton>
        </Box>

        <Box sx={{ mb: 3, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 2 }}>
          <QuickAction
            icon={<PersonOutlineOutlined sx={{ fontSize: 34 }} />}
            label="Hồ sơ"
            onClick={() => navigate('/customer/profile')}
          />
          <QuickAction
            icon={<HistoryOutlined sx={{ fontSize: 34 }} />}
            label="Lịch sử"
            onClick={() => navigate('/customer/history')}
          />
          <QuickAction
            icon={<GroupsOutlined sx={{ fontSize: 34 }} />}
            label="Cộng đồng"
            onClick={() => navigate('/customer/community')}
          />
        </Box>

        <Box sx={{ p: 2, borderRadius: CARD_RADIUS, bgcolor: '#eff6ff', border: '1px solid #bfdbfe' }}>
          <Typography sx={{ mb: 1, fontSize: 16, fontWeight: 800, color: NAVY }}>Mẹo hữu ích</Typography>
          <Typography sx={{ fontSize: 14, color: '#374151', lineHeight: 1.45 }}>
            Hãy kiểm tra lốp xe và mức dầu thường xuyên để tránh những sự cố không mong muốn trên đường.
          </Typography>
        </Box>
      </Box>
    </MobileLayout>
  );
}
