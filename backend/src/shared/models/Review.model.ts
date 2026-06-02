import { Schema, model, Document, Types } from 'mongoose';

export interface IReviewReply {
  content?: string;
  replied_at?: Date;
}

export interface IReview extends Document {
  rescue_request_id: Types.ObjectId;
  user_id: Types.ObjectId;
  company_id: Types.ObjectId;
  rating: number;
  content?: string;
  is_visible?: boolean;
  removed_by?: Types.ObjectId;
  removal_reason?: string;
  removed_at?: Date;
  reply?: IReviewReply;
  created_at?: Date;
  updated_at?: Date;
}

const ReplySchema = new Schema<IReviewReply>(
  {
    content: { type: String },
    replied_at: { type: Date },
  },
  { _id: false }
);

const ReviewSchema = new Schema<IReview>(
  {
    rescue_request_id: { type: Schema.Types.ObjectId, ref: 'RescueRequest', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    content: { type: String },
    is_visible: { type: Boolean },
    removed_by: { type: Schema.Types.ObjectId, ref: 'Admin' },
    removal_reason: { type: String },
    removed_at: { type: Date },
    reply: { type: ReplySchema },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'reviews',
  }
);

ReviewSchema.index({ company_id: 1 });
ReviewSchema.index({ user_id: 1 });
ReviewSchema.index({ rescue_request_id: 1 }, { unique: true });

export const Review = model<IReview>('Review', ReviewSchema);
