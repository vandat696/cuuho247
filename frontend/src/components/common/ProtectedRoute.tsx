import { AuthRole } from '@/types/auth.type';
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: [AuthRole];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('accessToken');
  // 1. Không có token -> về login
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // 2. Có token nhưng role không được phép -> về dashboard tương ứng
  // tạm thời chưa có dashboard -> về login
  if (allowedRoles && (!role || !allowedRoles.includes(role as AuthRole))) {
    return <Navigate to="/login" replace />;
  }
  // 3. Có token và role được phép -> render component
  return <>{children}</>;
}
