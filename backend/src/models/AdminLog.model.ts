import { Schema, model, Document, Types } from 'mongoose';

export type AdminAction =
  | 'verify_company'
  | 'reject_company'
  | 'lock_user'
  | 'unlock_user'
  | 'lock_company'
  | 'unlock_company'
  | 'verify_user'
  | 'remove_review'
  | 'remove_post'
  | 'remove_reply'
  | 'request_more_docs';

export type AdminTargetType = 'user' | 'company' | 'review' | 'community_post';

export interface IAdminLog extends Document {
  admin_id: Types.ObjectId;
  action: AdminAction;
  target_type: AdminTargetType;
  target_id: Types.ObjectId;
  reason?: string;
  details?: Record<string, unknown>;
  created_at?: Date;
}

const AdminLogSchema = new Schema<IAdminLog>(
  {
    admin_id: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    action: {
      type: String,
      enum: [
        'verify_company',
        'reject_company',
        'lock_user',
        'unlock_user',
        'lock_company',
        'unlock_company',
        'verify_user',
        'remove_review',
        'remove_post',
        'remove_reply',
        'request_more_docs',
      ],
      required: true,
    },
    target_type: {
      type: String,
      enum: ['user', 'company', 'review', 'community_post'],
      required: true,
    },
    target_id: { type: Schema.Types.ObjectId, required: true },
    reason: { type: String },
    details: { type: Schema.Types.Mixed },
  },
  {
    // AdminLog chỉ có created_at, không có updated_at
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'admin_logs',
  }
);

AdminLogSchema.index({ admin_id: 1, created_at: -1 });
AdminLogSchema.index({ target_type: 1, target_id: 1 });

export const AdminLog = model<IAdminLog>('AdminLog', AdminLogSchema);
