import { Schema, model, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  user_id: string; // references User, Company, or Admin ID
  token: string;
  expires_at: Date;
  created_at?: Date;
  updated_at?: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    user_id: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires_at: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'refresh_tokens',
  }
);

// Auto-delete expired tokens
RefreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
