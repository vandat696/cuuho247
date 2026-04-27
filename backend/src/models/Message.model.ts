import { Schema, model, Document, Types } from 'mongoose';

export type SenderType = 'user' | 'company';
export type ContentType = 'text' | 'image';

export interface IMessage extends Document {
  rescue_request_id: Types.ObjectId;
  sender_type: SenderType;
  sender_id: Types.ObjectId;
  content: string;
  content_type?: ContentType;
  is_read?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    rescue_request_id: { type: Schema.Types.ObjectId, ref: 'RescueRequest', required: true },
    sender_type: { type: String, enum: ['user', 'company'], required: true },
    sender_id: { type: Schema.Types.ObjectId, required: true },
    content: { type: String, required: true },
    content_type: { type: String, enum: ['text', 'image'] },
    is_read: { type: Boolean },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'messages',
  }
);

MessageSchema.index({ rescue_request_id: 1, created_at: 1 });

export const Message = model<IMessage>('Message', MessageSchema);
