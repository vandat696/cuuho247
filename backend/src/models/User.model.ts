import { Schema, model, Document } from 'mongoose';

export type UserStatus = 'active' | 'locked' | 'unverified';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  status?: UserStatus;
  is_verified?: boolean;
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String },
    avatar_url: { type: String },
    status: {
      type: String,
      enum: ['active', 'locked', 'unverified'],
    },
    is_verified: { type: Boolean },
    last_login_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'users',
  }
);

export const User = model<IUser>('User', UserSchema);
