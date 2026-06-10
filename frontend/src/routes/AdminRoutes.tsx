import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

const AdminHomePage = React.lazy(() => import('@/pages/admin/AdminHomePage'));
const PendingCompaniesPage = React.lazy(() => import('@/pages/admin/companies/PendingCompaniesPage'));
const CompanyVerificationDetailPage = React.lazy(() => import('@/pages/admin/companies/CompanyVerificationDetailPage'));
const AdminLogsPage = React.lazy(() => import('@/pages/admin/logs/AdminLogsPage'));
const AdminReviewsPage = React.lazy(() => import('@/pages/admin/reviews/AdminReviewsPage'));
const UserListPage = React.lazy(() => import('@/pages/admin/users/UserListPage'));
const UserDetailPage = React.lazy(() => import('@/pages/admin/users/UserDetailPage'));
const CompanyDetailPage = React.lazy(() => import('@/pages/admin/companies/CompanyDetailPage'));
const AdminReportsPage = React.lazy(() => import('@/pages/admin/reports/AdminReportsPage'));
const AdminServiceQualityPage = React.lazy(() => import('@/pages/admin/reports/AdminServiceQualityPage'));

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
      <Route
        path="reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="reports/service-quality"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminServiceQualityPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="users/:userId"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="companies/:companyId/detail"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CompanyDetailPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
