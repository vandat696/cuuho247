import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input, Textarea } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { FileUpload } from '@/components/common/FileUpload';
import { InfoField } from '@/components/common/InfoField';
import { NotificationCard, SharedNotificationData } from '@/components/common/NotificationCard';
import { Box, Typography } from '@mui/material';
import { CancelButton } from '@/components/rescue-customer/CancelButton';
import { useState } from 'react';
import { CancelRequestSheet } from '@/components/rescue-customer/CancelRequestSheet';
import { PersonOutlineOutlined, EmailOutlined, PhoneOutlined, LocationOnOutlined } from '@mui/icons-material';

const sampleNotifications: SharedNotificationData[] = [
  {
    id: '1',
    title: 'Yêu cầu được chấp nhận',
    body: 'Công ty ABC đã chấp nhận yêu cầu cứu hộ của bạn.',
    timeAgo: '5 phút trước',
    createdAt: Date.now() - 300000,
    kind: 'success',
    isRead: false,
    detailPath: '/customer/tracking/1',
  },
  {
    id: '2',
    title: 'Tin nhắn mới',
    body: 'Bạn có tin nhắn mới từ đội cứu hộ.',
    timeAgo: '1 giờ trước',
    createdAt: Date.now() - 3600000,
    kind: 'message',
    isRead: true,
    detailPath: '/chat',
  },
  {
    id: '3',
    title: 'Cảnh báo thời tiết',
    body: 'Trời mưa to tại khu vực của bạn, hãy lái xe cẩn thận.',
    timeAgo: '3 giờ trước',
    createdAt: Date.now() - 10800000,
    kind: 'warning',
    isRead: true,
    detailPath: '/',
  },
];

const selectOptions = [
  { id: 'car', label: 'Ô tô' },
  { id: 'motorbike', label: 'Xe máy' },
  { id: 'truck', label: 'Xe tải' },
];

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <Typography variant="h2" sx={{ fontSize: '1.125rem', mb: 1.5 }}>
    {children}
  </Typography>
);

const ShowcasePage = () => {
  const [showSheet, setShowSheet] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  return (
    <MobileLayout>
      <AppHeader title="Component Showcase" onBack={() => console.log('Back clicked')} />

      <Box sx={{ p: 2, pb: 10, overflowY: 'auto' }}>
        {/* ── Buttons ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>Buttons</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button variant="primary" fullWidth>
              Primary Button
            </Button>
            <Button variant="secondary" fullWidth>
              Secondary Button
            </Button>
            <Button variant="outline" fullWidth>
              Outline Button
            </Button>
            <Button variant="ghost" fullWidth>
              Ghost Button
            </Button>
            {/* ── Cancel Button ── */}
            <Box component="section" sx={{ mb: 3 }}>
              <SectionTitle>Cancel Button</SectionTitle>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <CancelButton status="pending" onCancel={() => setShowSheet(true)} />
                <CancelButton status="in_progress" onCancel={() => {}} />
              </Box>
            </Box>

            {/* Cancel Request Sheet */}
            <CancelRequestSheet
              isOpen={showSheet}
              onClose={() => setShowSheet(false)}
              onConfirm={(reason) => {
                console.log('Reason:', reason);
                setShowSheet(false);
              }}
            />
          </Box>
        </Box>

        {/* ── Inputs ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>Inputs</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Input label="Standard Input" placeholder="Enter text..." />
            <Input label="Input with Hint" placeholder="example@email.com" hint="Nhập email của bạn" />
            <Input label="Input with Error" error="Trường này không được để trống" placeholder="Enter text..." />
            <Input label="Disabled Input" disabled placeholder="Không thể nhập" />
            <Input label="Password" type="password" placeholder="Nhập mật khẩu" />
            <Input
              label="Input with Icons"
              placeholder="Nhập email..."
              leftIcon={<EmailOutlined sx={{ fontSize: 20 }} />}
            />
          </Box>
        </Box>

        {/* ── Textarea ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>Textarea</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Textarea label="Mô tả sự cố" placeholder="Mô tả chi tiết tình huống cần cứu hộ..." rows={4} />
            <Textarea label="Textarea có lỗi" error="Vui lòng nhập mô tả" placeholder="Nhập nội dung..." rows={3} />
          </Box>
        </Box>

        {/* ── Select ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>Select</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Select
              id="vehicle-type"
              label="Loại phương tiện"
              options={selectOptions}
              placeholder="-- Chọn loại xe --"
            />
            <Select
              id="vehicle-type-error"
              label="Select có lỗi"
              options={selectOptions}
              placeholder="-- Chọn --"
              error="Vui lòng chọn loại xe"
            />
          </Box>
        </Box>

        {/* ── Cards ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>Cards</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Card>
              <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>
                Default Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thẻ nội dung mặc định với viền xám nhạt.
              </Typography>
            </Card>

            <Card variant="shadow">
              <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>
                Shadow Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thẻ với hiệu ứng đổ bóng nhẹ, không viền.
              </Typography>
            </Card>

            <Card variant="orange">
              <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>
                Orange Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thẻ nền cam nhạt, dùng cho cảnh báo hoặc nổi bật.
              </Typography>
            </Card>

            <Card variant="navy">
              <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5, color: '#fff' }}>
                Navy Card
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Thẻ nền xanh đậm, chữ trắng.
              </Typography>
            </Card>

            <Card onClick={() => console.log('Card clicked')}>
              <Typography variant="h3" sx={{ fontSize: '1rem', mb: 0.5 }}>
                Clickable Card
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Thẻ có thể nhấn, có hiệu ứng hover và con trỏ pointer.
              </Typography>
            </Card>
          </Box>
        </Box>

        {/* ── Confirm Dialog ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>Confirm Dialog</SectionTitle>
          <Button variant="outline" fullWidth onClick={() => setShowConfirmDialog(true)}>
            Mở Confirm Dialog
          </Button>
          <ConfirmDialog
            open={showConfirmDialog}
            onClose={() => setShowConfirmDialog(false)}
            onConfirm={() => {
              console.log('Confirmed!');
              setShowConfirmDialog(false);
            }}
            title="Xác nhận xóa"
            content="Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác."
            confirmText="Xóa"
            cancelText="Hủy"
          />
        </Box>

        {/* ── File Upload ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>File Upload</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <FileUpload
              label="Tải lên giấy phép kinh doanh"
              hint="Hỗ trợ: PDF, JPG, PNG (Tối đa 5MB)"
              onFileSelect={(file) => console.log('Selected file:', file?.name)}
            />
            <FileUpload
              label="Upload có lỗi"
              error="Vui lòng tải lên tài liệu"
              onFileSelect={(file) => console.log('Selected file:', file?.name)}
            />
          </Box>
        </Box>

        {/* ── Info Field ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>Info Field</SectionTitle>
          <Card>
            <InfoField icon={<PersonOutlineOutlined />} label="Họ và tên" value="Nguyễn Văn A" />
            <InfoField icon={<EmailOutlined />} label="Email" value="nguyenvana@email.com" />
            <InfoField icon={<PhoneOutlined />} label="Số điện thoại" value="0912 345 678" />
            <InfoField icon={<LocationOnOutlined />} label="Địa chỉ" value="123 Nguyễn Huệ, Quận 1, TP.HCM" />
          </Card>
        </Box>

        {/* ── Notification Card ── */}
        <Box component="section" sx={{ mb: 3 }}>
          <SectionTitle>Notification Card</SectionTitle>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {sampleNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={() => console.log('Notification clicked:', notification.id)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default ShowcasePage;
