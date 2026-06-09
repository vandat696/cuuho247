import { Schema, model, Document, Types } from 'mongoose';

export interface ICommunityPost extends Document {
  user_id: Types.ObjectId;
  title: string;
  content: string;
  images?: string[];
  tags?: Types.ObjectId[];
  is_visible?: boolean;
  removed_by?: Types.ObjectId;
  removal_reason?: string;
  removed_at?: Date;
  like_count: number;
  comment_count: number;
  created_at?: Date;
  updated_at?: Date;
}

const CommunityPostSchema = new Schema<ICommunityPost>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'ServiceCategory' }],
    is_visible: { type: Boolean, default: true },
    removed_by: { type: Schema.Types.ObjectId, ref: 'Admin' },
    removal_reason: { type: String },
    removed_at: { type: Date },
    like_count: { type: Number, default: 0 },
    comment_count: { type: Number, default: 0 },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'community_posts',
  }
);

CommunityPostSchema.index({ user_id: 1 });
CommunityPostSchema.index({ tags: 1 });
CommunityPostSchema.index({ created_at: -1 });

export const CommunityPost = model<ICommunityPost>('CommunityPost', CommunityPostSchema);
