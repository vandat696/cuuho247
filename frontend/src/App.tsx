import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ShowcasePage from '@/pages/ShowcasePage';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/auth/LoginPage';
import RoleSelectionPage from '@/pages/auth/RoleSelectionPage';
import CustomerRegisterPage from '@/pages/auth/CustomerRegisterPage';
import CompanyRegisterPage from '@/pages/auth/CompanyRegisterPage';


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
        <Route path="/" element={<HomePage />} />
        <Route path = "/login" element = {<LoginPage />} />
        <Route path = "/register" element = {<RoleSelectionPage />} />
        <Route path = "/register/customer" element = {<CustomerRegisterPage />} />
        <Route path = "/register/company" element = {<CompanyRegisterPage />} />

        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
