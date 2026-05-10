import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ShowcasePage from '@/pages/ShowcasePage';
import VehicleListPage from './pages/rescue-company/VehicleListPage';
import VehicleFormPage from './pages/rescue-company/VehicleFormPage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RoleSelectionPage from '@/pages/auth/RoleSelectionPage';
import CustomerRegisterPage from '@/pages/auth/CustomerRegisterPage';
import CompanyProfilePage from '@/pages/rescue-company/CompanyProfilePage';
import { ProtectedRoute } from './components/common/ProtectedRoute';

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

      <Routes>
        {/* Rescue Company Routes */}
        <Route path="/company/vehicles" element={<VehicleListPage />} />
        <Route path="/company/vehicles/new" element={<VehicleFormPage />} />
        <Route path="/company/vehicles/:id/edit" element={<VehicleFormPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RoleSelectionPage />} />
        <Route path="/register/customer" element={<CustomerRegisterPage />} />

        <Route path="/company/:id" element={<CompanyProfilePage />} />

        {/* <Route
          path="/company/:id"
          element={
            <ProtectedRoute allowedRoles={['company']}>
              <ShowcasePage />
            </ProtectedRoute>
          }
        /> */}

        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
