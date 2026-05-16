import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import { CompanyResult } from '@/types/rescue.type';
import { CompanyCard } from './CompanyCard';

interface CompanyListProps {
  companies: CompanyResult[];
  isLoading?: boolean;
  onViewDetail?: (company: CompanyResult) => void;
}

function CardSkeleton() {
  return (
    <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: '16px', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="text" width="20%" height={24} />
      </Box>
      <Skeleton variant="text" width="40%" height={18} sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="70%" height={18} sx={{ mb: 1.5 }} />
      <Skeleton variant="rounded" height={36} sx={{ borderRadius: '8px' }} />
    </Box>
  );
}

export function CompanyList({ companies, isLoading = false, onViewDetail }: CompanyListProps) {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </Box>
    );
  }

  if (companies.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          py: 6,
          px: 2,
        }}
      >
        {/* Empty icon */}
        <Box sx={{ color: '#a0aec0' }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </Box>
        <Typography variant="h4" sx={{ color: 'text.primary', textAlign: 'center' }}>
          Không tìm thấy công ty cứu hộ
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', lineHeight: 1.6 }}>
          Không có công ty cứu hộ nào phù hợp trong khu vực của bạn. Vui lòng thử lại với phạm vi rộng hơn hoặc loại sự
          cố khác.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {companies.map((company) => (
        <CompanyCard key={company._id} company={company} onViewDetail={onViewDetail} />
      ))}
    </Box>
  );
}
