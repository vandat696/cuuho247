import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ShowcasePage from '@/pages/ShowcasePage';
import VehicleListPage from './pages/rescue-company/VehicleListPage';
import VehicleFormPage from './pages/rescue-company/VehicleFormPage';

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
        <Route path="/" element={<ShowcasePage />} />

        {/* Rescue Company Routes */}
        <Route path="/company/vehicles" element={<VehicleListPage />} />
        <Route path="/company/vehicles/new" element={<VehicleFormPage />} />
        <Route path="/company/vehicles/:id/edit" element={<VehicleFormPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
