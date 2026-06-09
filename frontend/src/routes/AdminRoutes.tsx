import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

const AdminHomePage = React.lazy(() => import('@/pages/admin/AdminHomePage'));
const PendingCompaniesPage = React.lazy(() => import('@/pages/admin/PendingCompaniesPage'));
const CompanyVerificationDetailPage = React.lazy(() => import('@/pages/admin/CompanyVerificationDetailPage'));
const AdminLogsPage = React.lazy(() => import('@/pages/admin/AdminLogsPage'));
const AdminReviewsPage = React.lazy(() => import('@/pages/admin/AdminReviewsPage'));

export function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="home"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminHomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="companies/pending"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <PendingCompaniesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="companies/:companyId/verify"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CompanyVerificationDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="logs"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLogsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="reviews"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReviewsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
