import { Schema, model, Document } from 'mongoose';

export interface IAdmin extends Document {
  email: string;
  password_hash: string;
  full_name: string;
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: { type: String, required: true },
    password_hash: { type: String, required: true },
    full_name: { type: String, required: true },
    last_login_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'admins',
  }
);

export const Admin = model<IAdmin>('Admin', AdminSchema);
