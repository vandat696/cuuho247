import { Box, Typography, SvgIconProps } from '@mui/material';
import { ApartmentRounded as ApartmentIcon } from '@mui/icons-material';
import { Card } from '@/components/common/Card';
import { Company } from '@/types/common.type';

interface CompanyInfoCardProps {
  company: Partial<Company> & { name?: string; status?: string };
  onClick?: () => void;
  icon?: React.ElementType<SvgIconProps>;
}

export const CompanyInfoCard = ({ company, onClick, icon: Icon = ApartmentIcon }: CompanyInfoCardProps) => {
  if (!company) return null;

  const companyName = company.company_name || company.name;
  const isActive =
    company.is_active !== undefined
      ? company.is_active
      : company.status === 'Đang hoạt động' || company.status === 'active';

  const getStatusText = () => {
    if (company.status === 'active') return 'Đang hoạt động';
    if (company.status === 'pending_verification') return 'Chờ xác minh';
    if (company.status === 'locked') return 'Đã khóa';
    if (company.status === 'rejected') return 'Từ chối';
    return company.status || (isActive ? 'Đang hoạt động' : 'Ngừng hoạt động');
  };

  const statusText = getStatusText();

  return (
    <Card
      variant="navy"
      padding="lg"
      onClick={onClick}
      sx={{
        background: 'linear-gradient(135deg, #1a3a5c 0%, #2d5986 100%)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, minWidth: 0 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'rgba(255,255,255,0.15)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon sx={{ fontSize: 34, color: 'common.white' }} />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography variant="h6" sx={{ color: 'common.white', fontWeight: 'bold', lineHeight: 1.2, mb: 0.5 }}>
              {companyName}
            </Typography>
            {(company.status !== undefined || company.is_active !== undefined) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: isActive ? '#4caf50' : 'grey.400',
                  }}
                />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)' }}>
                  {statusText}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
