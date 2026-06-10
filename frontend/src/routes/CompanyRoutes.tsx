import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Company Pages
const CompanyHomePage = React.lazy(() => import('@/pages/rescue-company/CompanyHomePage'));
const CompanyProfilePage = React.lazy(() => import('@/pages/rescue-company/CompanyProfilePage'));
const CompanyProfileEditPage = React.lazy(() => import('@/pages/rescue-company/CompanyProfileEditPage'));
const CompanyReviewsPage = React.lazy(() => import('@/pages/rescue-company/CompanyReviewsPage'));
const CompanyNotificationsPage = React.lazy(
  () => import('@/pages/rescue-company/notifications/CompanyNotificationsPage')
);

// Company Rescue Pages (Unified)
const RescueRequestListPage = React.lazy(() => import('@/pages/rescue-company/rescue/RescueRequestListPage'));
const RescueRequestDetailPage = React.lazy(() => import('@/pages/rescue-company/rescue/RescueRequestDetailPage'));

// Company Service & Vehicle Pages
const VehicleListPage = React.lazy(() => import('@/pages/rescue-company/vehicle/VehicleListPage'));
const VehicleFormPage = React.lazy(() => import('@/pages/rescue-company/vehicle/VehicleFormPage'));
const ServiceListPage = React.lazy(() => import('@/pages/rescue-company/service/ServiceListPage'));
const ServiceFormPage = React.lazy(() => import('@/pages/rescue-company/service/ServiceFormPage'));
const ServiceDetailPage = React.lazy(() => import('@/pages/rescue-company/service/ServiceDetailPage'));

export function CompanyRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="/company/home" replace />} />
      <Route path="home" element={<CompanyHomePage />} />
      <Route path="profile" element={<CompanyProfilePage />} />
      <Route path="profile/edit" element={<CompanyProfileEditPage />} />
      <Route path="notifications" element={<CompanyNotificationsPage />} />
      <Route path="reviews" element={<CompanyReviewsPage />} />

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
    </Routes>
  );
}
