import { Types } from 'mongoose';
import { Notification, INotification, NotificationType, RecipientType } from '../../shared/models/Notification.model';

class NotificationRepository {
  async findByRecipient(recipientId: string, recipientType: RecipientType): Promise<INotification[]> {
    return Notification.find({
      recipient_id: new Types.ObjectId(recipientId),
      recipient_type: recipientType,
    })
      .sort({ created_at: -1 })
      .exec();
  }

  async markAsRead(notificationId: string, recipientId: string): Promise<INotification | null> {
    return Notification.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        recipient_id: new Types.ObjectId(recipientId),
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

  async markAllAsRead(recipientId: string, recipientType: RecipientType): Promise<void> {
    await Notification.updateMany(
      {
        recipient_id: new Types.ObjectId(recipientId),
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

  async create(data: Partial<INotification>): Promise<INotification> {
    return Notification.create(data);
  }
}

export const notificationRepository = new NotificationRepository();
