import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';

export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    // Clear all auth related local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('accountId');
    localStorage.removeItem('accountPhone');
    localStorage.removeItem('accountName');
    localStorage.removeItem('companyId');
    localStorage.removeItem('companyReadNotificationIds');

    toast.success('Đăng xuất thành công');
    navigate('/login', { replace: true });
  };

  return { handleLogout };
};
