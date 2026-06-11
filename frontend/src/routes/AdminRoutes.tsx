import React, { Suspense } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';

const AdminHomePage = React.lazy(() => import('@/pages/admin/AdminHomePage'));
const PendingCompaniesPage = React.lazy(() => import('@/pages/admin/companies/PendingCompaniesPage'));
const CompanyVerificationDetailPage = React.lazy(() => import('@/pages/admin/companies/CompanyVerificationDetailPage'));
const AdminLogsPage = React.lazy(() => import('@/pages/admin/activity-logs/AdminLogsPage'));
const AdminReviewsPage = React.lazy(() => import('@/pages/admin/reviews/AdminReviewsPage'));
const UserListPage = React.lazy(() => import('@/pages/admin/users/UserListPage'));
const UserDetailPage = React.lazy(() => import('@/pages/admin/users/UserDetailPage'));
const CompanyDetailPage = React.lazy(() => import('@/pages/admin/companies/CompanyDetailPage'));
const AdminReportsPage = React.lazy(() => import('@/pages/admin/reports/AdminReportsPage'));
const AdminServiceQualityPage = React.lazy(() => import('@/pages/admin/reports/AdminServiceQualityPage'));

const SuspenseFallback = () => (
  <div style={{ padding: 20, textAlign: 'center', fontFamily: 'var(--font)' }}>Đang tải...</div>
);

export function AdminRoutes() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <Routes>
        <Route
          element={
            <AdminLayout>
              <Suspense fallback={<SuspenseFallback />}>
                <Outlet />
              </Suspense>
            </AdminLayout>
          }
        >
          <Route path="home" element={<AdminHomePage />} />
          <Route path="companies/pending" element={<PendingCompaniesPage />} />
          <Route path="companies/:companyId/verify" element={<CompanyVerificationDetailPage />} />
          <Route path="logs" element={<AdminLogsPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="reports/service-quality" element={<AdminServiceQualityPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="users/:userId" element={<UserDetailPage />} />
          <Route path="companies/:companyId/detail" element={<CompanyDetailPage />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}
