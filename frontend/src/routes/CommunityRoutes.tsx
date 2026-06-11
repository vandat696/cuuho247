import React from 'react';
import { Routes, Route } from 'react-router-dom';

const CommunityListPage = React.lazy(() => import('@/pages/community/CommunityListPage'));
const CommunityCreatePage = React.lazy(() => import('@/pages/community/CommunityCreatePage'));
const CommunityDetailPage = React.lazy(() => import('@/pages/community/CommunityDetailPage'));

export function CommunityRoutes() {
  return (
    <Routes>
      <Route index element={<CommunityListPage />} />
      <Route path="create" element={<CommunityCreatePage />} />
      <Route path=":id" element={<CommunityDetailPage />} />
    </Routes>
  );
}
export default CommunityRoutes;
