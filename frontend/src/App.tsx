import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ShowcasePage from '@/pages/ShowcasePage';
import VehicleListPage from './pages/rescue-company/vehicle/VehicleListPage';
import VehicleFormPage from './pages/rescue-company/vehicle/VehicleFormPage';
import ServiceListPage from './pages/rescue-company/service/ServiceListPage';
import ServiceDetailPage from './pages/rescue-company/service/ServiceDetailPage';
import ServiceFormPage from './pages/rescue-company/service/ServiceFormPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RoleSelectionPage from '@/pages/auth/RoleSelectionPage';
import CustomerRegisterPage from '@/pages/auth/CustomerRegisterPage';
import CompanyRegisterPage from '@/pages/auth/CompanyRegisterPage';
import CompanyProfilePage from '@/pages/rescue-company/CompanyProfilePage';
// import { ProtectedRoute } from './components/common/ProtectedRoute';
import RescueRequestPage from '@/pages/customer/RescueRequestPage';
import RescueResultsPage from '@/pages/customer/RescueResultsPage';
import CompanyHomePage from './pages/rescue-company/CompanyHomePage';
import PendingRescueRequestsPage from './pages/rescue-company/rescue/PendingRescueRequestsPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'var(--font)',
            fontSize: 'var(--fs-sm)',
            borderRadius: 'var(--r-md)',
          },
        }}
      />

      <Routes>
        {/* Rescue Company Routes */}
        <Route path="/company/vehicles" element={<VehicleListPage />} />
        <Route path="/company/vehicles/new" element={<VehicleFormPage />} />
        <Route path="/company/vehicles/:id/edit" element={<VehicleFormPage />} />

        {/* Service Routes */}
        <Route path="/company/services" element={<ServiceListPage />} />
        <Route path="/company/services/new" element={<ServiceFormPage />} />
        <Route path="/company/services/:serviceId" element={<ServiceDetailPage />} />
        <Route path="/company/services/:serviceId/edit" element={<ServiceFormPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RoleSelectionPage />} />
        <Route path="/register/customer" element={<CustomerRegisterPage />} />
        <Route path="/register/company" element={<CompanyRegisterPage />} />

        <Route path="/company" element={<Navigate to="/company/home" replace />} />
        <Route path="/company/home" element={<CompanyHomePage />} />
        <Route path="/company/profile" element={<CompanyProfilePage />} />
        <Route path="/company/rescue/pending" element={<PendingRescueRequestsPage />} />
        {/* <Route
          path="/company/:id"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <ShowcasePage />
            </ProtectedRoute>
          }
        /> */}
        <Route path="/rescue/request" element={<RescueRequestPage />} />
        <Route path="/rescue/search" element={<RescueResultsPage />} />

        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
