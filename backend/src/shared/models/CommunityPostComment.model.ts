import { Schema, model, Document, Types } from 'mongoose';

export interface ICommunityPostComment extends Document {
  post_id: Types.ObjectId;
  user_id: Types.ObjectId;
  content: string;
  is_visible?: boolean;
  removed_by?: Types.ObjectId;
  removal_reason?: string;
  removed_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const CommunityPostCommentSchema = new Schema<ICommunityPostComment>(
  {
    post_id: { type: Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    is_visible: { type: Boolean, default: true },
    removed_by: { type: Schema.Types.ObjectId, ref: 'Admin' },
    removal_reason: { type: String },
    removed_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'community_post_comments',
  }
);

CommunityPostCommentSchema.index({ post_id: 1 });
CommunityPostCommentSchema.index({ user_id: 1 });
CommunityPostCommentSchema.index({ created_at: -1 });

export const CommunityPostComment = model<ICommunityPostComment>('CommunityPostComment', CommunityPostCommentSchema);
