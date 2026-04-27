import { Schema, model, Document, Types } from 'mongoose';

export type RecipientType = 'user' | 'company' | 'admin';

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
  | 'chat_message'
  | 'content_removed'
  | 'eta_updated';

export interface INotification extends Document {
  recipient_type: RecipientType;
  recipient_id: Types.ObjectId;
  type: NotificationType;
  title: string;
  body: string;
  payload?: Record<string, unknown>;
  is_read?: boolean;
  read_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient_type: { type: String, enum: ['user', 'company', 'admin'], required: true },
    recipient_id: { type: Schema.Types.ObjectId, required: true },
    type: {
      type: String,
      enum: [
        'request_created',
        'request_accepted',
        'request_rejected',
        'request_in_progress',
        'request_completed',
        'request_cancelled',
        'request_timeout',
        'company_approved',
        'company_rejected',
        'chat_message',
        'content_removed',
        'eta_updated',
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    payload: { type: Schema.Types.Mixed },
    is_read: { type: Boolean },
    read_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'notifications',
  }
);

NotificationSchema.index({ recipient_id: 1, is_read: 1, created_at: -1 });

export const Notification = model<INotification>('Notification', NotificationSchema);
