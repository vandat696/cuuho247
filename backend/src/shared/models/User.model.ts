import { Schema, model, Document } from 'mongoose';

export type UserStatus = 'active' | 'locked';

export interface IUser extends Document {
  email: string;
  password_hash: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  status?: UserStatus;
  lock_reason?: string;
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String, unique: true, sparse: true },
    avatar_url: { type: String },
    status: {
      type: String,
      enum: ['active', 'locked'],
      default: 'active',
    },
    lock_reason: { type: String },
    last_login_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'users',
  }
);

export const User = model<IUser>('User', UserSchema);
