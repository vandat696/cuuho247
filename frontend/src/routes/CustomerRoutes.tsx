import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const CustomerHomePage = React.lazy(() => import('@/pages/customer/CustomerHomePage'));
const CustomerHistoryPage = React.lazy(() => import('@/pages/customer/CustomerHistoryPage'));
const RescueTrackingPage = React.lazy(() => import('@/pages/customer/RescueTrackingPage'));

export function CustomerRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="/customer/home" replace />} />
      <Route path="home" element={<CustomerHomePage />} />
      <Route path="history" element={<CustomerHistoryPage />} />
      <Route path="tracking/:requestId" element={<RescueTrackingPage />} />
    </Routes>
  );
}
