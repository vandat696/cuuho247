import { useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { AppHeader } from '@/components/layout/AppHeader';
import { SearchResultHeader } from '@/components/rescue/SearchResultHeader';
import { CompanyList } from '@/components/rescue/CompanyList';
import { RescueSearchState, CompanyResult } from '@/types/rescue.type';
import toast from 'react-hot-toast';

export default function RescueResultsPage() {
  const navigate = useNavigate();
  const locationState = useLocation().state as RescueSearchState | null;

  // Guard: if user navigates here directly without state, redirect back
  if (!locationState) {
    return (
      <MobileLayout>
        <AppHeader title="Kết quả tìm kiếm" onBack={() => navigate('/rescue/request')} />
        <Box
          sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4, textAlign: 'center' }}
        >
          <Box>
            <Box sx={{ color: '#a0aec0', mb: 2 }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </Box>
            <Box sx={{ fontSize: 16, color: '#1e3a5f', fontWeight: 600, mb: 1 }}>Không có dữ liệu tìm kiếm</Box>
            <Box
              component="button"
              onClick={() => navigate('/rescue/request')}
              sx={{
                mt: 2,
                px: 3,
                py: 1.5,
                bgcolor: '#ff6b00',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Quay lại tìm kiếm
            </Box>
          </Box>
        </Box>
      </MobileLayout>
    );
  }

  const { formData, results } = locationState;

  const displayAddress = formData.location?.address || 'Vị trí của bạn';

  const handleViewDetail = (company: CompanyResult) => {
    toast(`${company.company_name} – ${company.phone}`, { icon: '📞' });
  };

  return (
    <MobileLayout>
      <AppHeader title="Kết quả tìm kiếm" onBack={() => navigate('/rescue/request')} />

      <Box component="main" sx={{ flex: 1, overflowY: 'auto', bgcolor: '#fff' }}>
        <SearchResultHeader
          incidentTypeLabel={formData.incident_type_label}
          address={displayAddress}
          totalResults={results.total}
          onFilter={() => toast('Tính năng lọc sẽ sớm ra mắt', { icon: '🔧' })}
        />

        <Box sx={{ px: 2, py: 1, bgcolor: '#fff' }}>
          <CompanyList companies={results.companies} onViewDetail={handleViewDetail} />
        </Box>
      </Box>
    </MobileLayout>
  );
}
