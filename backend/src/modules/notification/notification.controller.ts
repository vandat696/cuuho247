import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { notificationService } from './notification.service';

class NotificationController {
  /**
   * GET /api/notifications
   * Fetch current user's notifications
   */
  async getMyNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Chưa xác thực' });
        return;
      }

      const notifications = await notificationService.getNotificationsForUser(req.user.id, req.user.role);

      res.status(200).json({
        status: 'success',
        message: 'Lấy danh sách thông báo thành công',
        data: {
          total: notifications.length,
          notifications,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notifications/:id/read
   * Mark a specific notification as read
   */
  async markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Chưa xác thực' });
        return;
      }

      const { id } = req.params;
      const notification = await notificationService.markAsRead(id, req.user.id);

      if (!notification) {
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy thông báo hoặc bạn không có quyền cập nhật thông báo này',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Đã đánh dấu thông báo đã đọc',
        data: { notification },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/notifications/read-all
   * Mark all notifications of the user as read
   */
  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ status: 'error', message: 'Chưa xác thực' });
        return;
      }

      await notificationService.markAllAsRead(req.user.id, req.user.role);

      res.status(200).json({
        status: 'success',
        message: 'Đã đánh dấu tất cả thông báo đã đọc',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
