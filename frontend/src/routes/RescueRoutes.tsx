import React from 'react';
import { Routes, Route } from 'react-router-dom';

const RescueRequestPage = React.lazy(() => import('@/pages/customer/RescueRequestPage'));
const RescueResultsPage = React.lazy(() => import('@/pages/customer/RescueResultsPage'));
const CompanyDetailsPage = React.lazy(() => import('@/pages/customer/CompanyDetailsPage'));
const ConfirmRequestPage = React.lazy(() => import('@/pages/customer/ConfirmRequestPage'));

export function RescueRoutes() {
  return (
    <Routes>
      <Route path="request" element={<RescueRequestPage />} />
      <Route path="search" element={<RescueResultsPage />} />
      <Route path="company/:id" element={<CompanyDetailsPage />} />
      <Route path="confirm" element={<ConfirmRequestPage />} />
    </Routes>
  );
}
