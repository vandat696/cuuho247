import { http } from './http';
import { ApiResponse } from '../types/common.type';

export type NotificationType =
  | 'request_created'
  | 'request_accepted'
  | 'request_rejected'
  | 'request_in_progress'
  | 'request_completed'
  | 'request_cancelled'
  | 'request_timeout'
  | 'company_approved'
  | 'company_rejected'
  | 'company_document_requested'
  | 'chat_message'
  | 'content_removed'
  | 'eta_updated'
  | 'review_submitted'
  | 'payment_reminder';

export interface NotificationData {
  _id: string;
  recipient_type: 'user' | 'company' | 'admin';
  recipient_id: string;
  type: NotificationType;
  title: string;
  body: string;
  payload?: {
    rescue_request_id?: string;
    [key: string]: any;
  };
  is_read: boolean;
  read_at?: string;
  created_at: string;
  updated_at?: string;
}

export const notificationService = {
  getMyNotifications: async (): Promise<ApiResponse<{ total: number; notifications: NotificationData[] }>> => {
    const response =
      await http.get<ApiResponse<{ total: number; notifications: NotificationData[] }>>('/notifications');
    return response.data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<{ notification: NotificationData }>> => {
    const response = await http.patch<ApiResponse<{ notification: NotificationData }>>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    const response = await http.post<ApiResponse<null>>('/notifications/read-all');
    return response.data;
  },
};
