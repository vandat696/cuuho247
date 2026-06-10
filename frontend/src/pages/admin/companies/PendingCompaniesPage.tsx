import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-hot-toast';

import { AppHeader } from '@/components/layout/AppHeader';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { CompanyVerificationCard } from '@/components/admin/CompanyVerificationCard';
import { adminService } from '@/services/admin.service';
import { Company } from '@/types/common.type';
import { NAVY } from '@/constants/colors';

export default function PendingCompaniesPage() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingCompanies();
  }, []);

  const fetchPendingCompanies = async () => {
    try {
      setLoading(true);
      const response = await adminService.getPendingCompanies();
      if (response.status === 'success') {
        setCompanies(response.data);
      }
    } catch (error) {
      console.error('Error fetching pending companies:', error);
      toast.error('Không thể tải danh sách hồ sơ chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Hồ sơ chờ duyệt" backFallback="/admin/home" />

      <Box sx={{ flex: 1, bgcolor: '#fff', px: 3, py: 3 }}>
        <Typography sx={{ mb: 2, fontSize: 16, fontWeight: 800, color: NAVY }}>
          Tổng số: {companies.length} công ty chờ duyệt
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : companies.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
            <Typography sx={{ fontSize: 14 }}>Không có hồ sơ nào đang chờ duyệt.</Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {companies.map((company) => (
              <CompanyVerificationCard
                key={company._id}
                company={company}
                onClick={() => navigate(`/admin/companies/${company._id}/verify`)}
              />
            ))}
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
}
