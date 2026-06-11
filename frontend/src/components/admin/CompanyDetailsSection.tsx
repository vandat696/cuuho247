import { Box, Typography } from '@mui/material';
import {
  ApartmentOutlined as CompanyIcon,
  PersonOutline as PersonIcon,
  PhoneOutlined as PhoneIcon,
  MailOutline as MailIcon,
  LocationOnOutlined as LocationIcon,
  DescriptionOutlined as LicenseIcon,
} from '@mui/icons-material';
import { InfoCard, InfoRow, formatAddress } from '@/components/rescue-company/RescueCompanyRequestShared';
import { Company } from '@/types/common.type';
import { ORANGE } from '@/constants/colors';

interface CompanyDetailsSectionProps {
  company: Company;
}

export default function CompanyDetailsSection({ company }: CompanyDetailsSectionProps) {
  const hasLicense = !!(company.license_file_url || company.license_url);

  return (
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
            Công ty cứu hộ chưa tải lên tệp hồ sơ pháp lý.
          </Typography>
        )}
      </InfoCard>
    </Box>
  );
}
