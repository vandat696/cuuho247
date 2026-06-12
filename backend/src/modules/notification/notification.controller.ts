import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../shared/middleware/auth.middleware';
import { notificationService } from './notification.service';
import { UnauthorizedError, NotFoundError } from '../../shared/utils/apiError.util';

class NotificationController {
  /**
   * GET /api/notifications
   * Fetch current user's notifications
   */
  async getMyNotifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Chưa xác thực');
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
        throw new UnauthorizedError('Chưa xác thực');
      }

      const { id } = req.params;
      const notification = await notificationService.markAsRead(id, req.user.id);

      if (!notification) {
        throw new NotFoundError('Không tìm thấy thông báo hoặc bạn không có quyền cập nhật thông báo này');
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
        throw new UnauthorizedError('Chưa xác thực');
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
