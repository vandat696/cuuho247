import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import toast from 'react-hot-toast';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { customerRescueService } from '@/services/customer-rescue.service';

const RescueRequestPage = React.lazy(() => import('@/pages/customer/RescueRequestPage'));
const RescueResultsPage = React.lazy(() => import('@/pages/customer/RescueResultsPage'));
const CompanyDetailsPage = React.lazy(() => import('@/pages/customer/CompanyDetailsPage'));
const ConfirmRequestPage = React.lazy(() => import('@/pages/customer/ConfirmRequestPage'));

function RescueFlowGuard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkActiveRequest = async () => {
      try {
        const response = await customerRescueService.getMyRequests();
        if (response.status === 'success') {
          const requests = response.data.requests || [];
          const active = requests.find(
            (r) => r.status && ['pending', 'accepted', 'in_progress', 'arrived'].includes(r.status)
          );
          if (active) {
            toast.error('Bạn đang có một yêu cầu cứu hộ đang diễn ra. Không thể tạo yêu cầu mới!');
            navigate('/customer/home', { replace: true });
            return;
          }
        }
      } catch (error) {
        console.error('Error checking active request:', error);
      } finally {
        setLoading(false);
      }
    };
    checkActiveRequest();
  }, [navigate]);

  if (loading) {
    return (
      <MobileLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Box>
      </MobileLayout>
    );
  }

  return <Outlet />;
}

export function RescueRoutes() {
  return (
    <Routes>
      <Route element={<RescueFlowGuard />}>
        <Route path="request" element={<RescueRequestPage />} />
        <Route path="search" element={<RescueResultsPage />} />
        <Route path="company/:id" element={<CompanyDetailsPage />} />
        <Route path="confirm" element={<ConfirmRequestPage />} />
      </Route>
    </Routes>
  );
}
