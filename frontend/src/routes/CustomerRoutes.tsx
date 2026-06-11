import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const CustomerHomePage = React.lazy(() => import('@/pages/customer/CustomerHomePage'));
const CustomerHistoryPage = React.lazy(() => import('@/pages/customer/CustomerHistoryPage'));
const RescueTrackingPage = React.lazy(() => import('@/pages/customer/RescueTrackingPage'));
const CustomerReviewPage = React.lazy(() => import('@/pages/customer/CustomerReviewPage'));
const CustomerProfilePage = React.lazy(() => import('@/pages/customer/CustomerProfilePage'));
const CustomerEditProfilePage = React.lazy(() => import('@/pages/customer/CustomerEditProfilePage'));
const CustomerNotificationsPage = React.lazy(() => import('@/pages/customer/notifications/CustomerNotificationsPage'));

export function CustomerRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="/customer/home" replace />} />
      <Route path="home" element={<CustomerHomePage />} />
      <Route path="history" element={<CustomerHistoryPage />} />
      <Route path="tracking/:requestId" element={<RescueTrackingPage />} />
      <Route path="review/:requestId" element={<CustomerReviewPage />} />
      <Route path="profile" element={<CustomerProfilePage />} />
      <Route path="profile/edit" element={<CustomerEditProfilePage />} />
      <Route path="notifications" element={<CustomerNotificationsPage />} />
    </Routes>
  );
}
