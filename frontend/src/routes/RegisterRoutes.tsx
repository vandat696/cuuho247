import React from 'react';
import { Routes, Route } from 'react-router-dom';

const RoleSelectionPage = React.lazy(() => import('@/pages/auth/RoleSelectionPage'));
const CustomerRegisterPage = React.lazy(() => import('@/pages/auth/CustomerRegisterPage'));
const CompanyRegisterPage = React.lazy(() => import('@/pages/auth/CompanyRegisterPage'));

export function RegisterRoutes() {
  return (
    <Routes>
      <Route index element={<RoleSelectionPage />} />
      <Route path="customer" element={<CustomerRegisterPage />} />
      <Route path="company" element={<CompanyRegisterPage />} />
    </Routes>
  );
}
