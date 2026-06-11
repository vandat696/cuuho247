import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSocket } from '@/utils/socket';
import toast from 'react-hot-toast';

export function GlobalNotificationListener() {
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const socket = getSocket();

    const handleNewNotification = (notification: any) => {
      if (!notification) return;

      const userRole = localStorage.getItem('role') || 'user';
      const pathname = window.location.pathname;

      // 1. Skip toast if self-initiated
      let selfInitiated = false;
      if (userRole === 'company') {
        selfInitiated = ['request_accepted', 'request_in_progress', 'eta_updated', 'request_completed'].includes(
          notification.type
        );
      } else {
        selfInitiated = ['request_created', 'request_cancelled', 'review_submitted'].includes(notification.type);
      }

      // 2. Skip toast if we are already on the ChatPage for this request
      const isChatPageForRequest =
        pathname.startsWith('/chat/') &&
        notification.type === 'chat_message' &&
        notification.payload?.rescue_request_id === pathname.split('/').pop();

      if (!selfInitiated && !isChatPageForRequest) {
        toast.success(`${notification.title}: ${notification.body}`, { duration: 5000 });
      }

      // Dispatch global event for local pages to update unread count/requests list
      window.dispatchEvent(new CustomEvent('notification_received', { detail: notification }));
    };

    socket.on('new_notification', handleNewNotification);

    return () => {
      socket.off('new_notification', handleNewNotification);
    };
  }, [location.pathname]);

  return null;
}
