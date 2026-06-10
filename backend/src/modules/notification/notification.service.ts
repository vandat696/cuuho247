import { Types } from 'mongoose';
import { Notification, INotification, NotificationType, RecipientType } from '../../shared/models/Notification.model';
import { getIo } from '../../socket';

export class NotificationService {
  /**
   * Fetch all notifications for the specified recipient
   */
  async getNotificationsForUser(userId: string, role: string): Promise<INotification[]> {
    const recipientType: RecipientType = role === 'customer' ? 'user' : (role as RecipientType);

    return Notification.find({
      recipient_id: new Types.ObjectId(userId),
      recipient_type: recipientType,
    })
      .sort({ created_at: -1 })
      .exec();
  }

  /**
   * Mark a single notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        recipient_id: new Types.ObjectId(userId),
      },
      {
        $set: {
          is_read: true,
          read_at: new Date(),
        },
      },
      { new: true }
    ).exec();
  }

  /**
   * Mark all notifications as read for a user/role
   */
  async markAllAsRead(userId: string, role: string): Promise<void> {
    const recipientType: RecipientType = role === 'customer' ? 'user' : (role as RecipientType);

    await Notification.updateMany(
      {
        recipient_id: new Types.ObjectId(userId),
        recipient_type: recipientType,
        is_read: { $ne: true },
      },
      {
        $set: {
          is_read: true,
          read_at: new Date(),
        },
      }
    ).exec();
  }

  /**
   * Helper to create a notification in database and send via websocket in real-time
   */
  async createAndSendNotification(
    recipientId: string,
    recipientType: RecipientType,
    type: NotificationType,
    title: string,
    body: string,
    payload?: Record<string, unknown>
  ): Promise<INotification> {
    const notification = await Notification.create({
      recipient_type: recipientType,
      recipient_id: new Types.ObjectId(recipientId),
      type,
      title,
      body,
      payload,
      is_read: false,
    });

    // Send real-time notification via Socket.IO
    const io = getIo();
    if (io) {
      const room = `user:${recipientId}`;
      io.to(room).emit('new_notification', {
        _id: notification._id,
        recipient_type: notification.recipient_type,
        recipient_id: notification.recipient_id,
        type: notification.type,
        title: notification.title,
        body: notification.body,
        payload: notification.payload,
        is_read: notification.is_read,
        created_at: notification.created_at,
      });
      console.log(`[Socket] Sent new_notification to room ${room}`);
    } else {
      console.warn('[Socket] Socket.IO instance not available in NotificationService');
    }

    return notification;
  }
}

export const notificationService = new NotificationService();
