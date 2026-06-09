import { Schema, model, Document, Types } from 'mongoose';

export interface ICommunityPostLike extends Document {
  post_id: Types.ObjectId;
  user_id: Types.ObjectId;
  created_at?: Date;
}

const CommunityPostLikeSchema = new Schema<ICommunityPostLike>(
  {
    post_id: { type: Schema.Types.ObjectId, ref: 'CommunityPost', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    collection: 'community_post_likes',
  }
);

CommunityPostLikeSchema.index({ post_id: 1, user_id: 1 }, { unique: true });

export const CommunityPostLike = model<ICommunityPostLike>('CommunityPostLike', CommunityPostLikeSchema);
