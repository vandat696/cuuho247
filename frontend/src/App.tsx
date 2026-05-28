import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Routes Submodules
import { RegisterRoutes } from './routes/RegisterRoutes';
import { RescueRoutes } from './routes/RescueRoutes';
import { CustomerRoutes } from './routes/CustomerRoutes';
import { CompanyRoutes } from './routes/CompanyRoutes';

// Suspense Fallback
const SuspenseFallback = () => (
  <div style={{ padding: 20, textAlign: 'center', fontFamily: 'var(--font)' }}>Đang tải...</div>
);

// Core / Public Pages
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ShowcasePage = React.lazy(() => import('@/pages/ShowcasePage'));
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));

// Chat Pages
const ChatPage = React.lazy(() => import('@/pages/chat/ChatPage'));

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

          {/* Sub-routing Modules */}
          <Route path="/register/*" element={<RegisterRoutes />} />
          <Route path="/rescue/*" element={<RescueRoutes />} />
          <Route path="/customer/*" element={<CustomerRoutes />} />
          <Route path="/company/*" element={<CompanyRoutes />} />

          {/* Chat Routes */}
          <Route path="/chat/:rescueRequestId" element={<ChatPage />} />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
