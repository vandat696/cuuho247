import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Suspense Fallback
const SuspenseFallback = () => (
  <div style={{ padding: 20, textAlign: 'center', fontFamily: 'var(--font)' }}>Đang tải...</div>
);

// Public & Auth Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ShowcasePage = React.lazy(() => import('@/pages/ShowcasePage'));
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RoleSelectionPage = React.lazy(() => import('@/pages/auth/RoleSelectionPage'));
const CustomerRegisterPage = React.lazy(() => import('@/pages/auth/CustomerRegisterPage'));
const CompanyRegisterPage = React.lazy(() => import('@/pages/auth/CompanyRegisterPage'));

// Customer Pages
const CustomerHomePage = React.lazy(() => import('@/pages/customer/CustomerHomePage'));
const CustomerHistoryPage = React.lazy(() => import('@/pages/customer/CustomerHistoryPage'));
const RescueRequestPage = React.lazy(() => import('@/pages/customer/RescueRequestPage'));
const RescueResultsPage = React.lazy(() => import('@/pages/customer/RescueResultsPage'));
const CompanyDetailsPage = React.lazy(() => import('@/pages/customer/CompanyDetailsPage'));
const ConfirmRequestPage = React.lazy(() => import('@/pages/customer/ConfirmRequestPage'));

// Company Pages
const CompanyHomePage = React.lazy(() => import('./pages/rescue-company/CompanyHomePage'));
const CompanyProfilePage = React.lazy(() => import('@/pages/rescue-company/CompanyProfilePage'));
const CompanyNotificationsPage = React.lazy(
  () => import('./pages/rescue-company/notifications/CompanyNotificationsPage')
);

// Company Rescue Pages (Unified)
const RescueRequestListPage = React.lazy(() => import('./pages/rescue-company/rescue/RescueRequestListPage'));
const RescueRequestDetailPage = React.lazy(() => import('./pages/rescue-company/rescue/RescueRequestDetailPage'));

// Company Service & Vehicle Pages
const VehicleListPage = React.lazy(() => import('./pages/rescue-company/vehicle/VehicleListPage'));
const VehicleFormPage = React.lazy(() => import('./pages/rescue-company/vehicle/VehicleFormPage'));
const ServiceListPage = React.lazy(() => import('./pages/rescue-company/service/ServiceListPage'));
const ServiceFormPage = React.lazy(() => import('./pages/rescue-company/service/ServiceFormPage'));
const ServiceDetailPage = React.lazy(() => import('./pages/rescue-company/service/ServiceDetailPage'));

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

      <Suspense fallback={<SuspenseFallback />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/showcase" element={<ShowcasePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/register">
            <Route index element={<RoleSelectionPage />} />
            <Route path="customer" element={<CustomerRegisterPage />} />
            <Route path="company" element={<CompanyRegisterPage />} />
          </Route>

          {/* Rescue Flow (Customer mix) */}
          <Route path="/rescue">
            <Route path="request" element={<RescueRequestPage />} />
            <Route path="search" element={<RescueResultsPage />} />
            <Route path="company/:id" element={<CompanyDetailsPage />} />
            <Route path="confirm" element={<ConfirmRequestPage />} />
          </Route>

          {/* Customer Routes */}
          <Route path="/customer">
            <Route index element={<Navigate to="/customer/home" replace />} />
            <Route path="home" element={<CustomerHomePage />} />
            <Route path="history" element={<CustomerHistoryPage />} />
          </Route>

          {/* Company Routes */}
          <Route path="/company">
            <Route index element={<Navigate to="/company/home" replace />} />
            <Route path="home" element={<CompanyHomePage />} />
            <Route path="profile" element={<CompanyProfilePage />} />
            <Route path="notifications" element={<CompanyNotificationsPage />} />

            {/* Company Vehicles */}
            <Route path="vehicles">
              <Route index element={<VehicleListPage />} />
              <Route path="new" element={<VehicleFormPage />} />
              <Route path=":id/edit" element={<VehicleFormPage />} />
            </Route>

            {/* Company Services */}
            <Route path="services">
              <Route index element={<ServiceListPage />} />
              <Route path="new" element={<ServiceFormPage />} />
              <Route path=":serviceId" element={<ServiceDetailPage />} />
              <Route path=":serviceId/edit" element={<ServiceFormPage />} />
            </Route>

            {/* Company Rescue Requests */}
            <Route path="rescue">
              <Route path=":status" element={<RescueRequestListPage />} />
              <Route path=":status/:requestId" element={<RescueRequestDetailPage />} />
            </Route>
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
