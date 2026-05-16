import { Schema, model, Document } from 'mongoose';
import { AddressSchema, GeoPointSchema, IAddress, IGeoPoint } from './shared';

export type CompanyStatus = 'pending_verification' | 'active' | 'rejected' | 'locked';

export interface ICompany extends Document {
  email: string;
  password_hash: string;
  company_name: string;
  director_name: string;
  phone: string;
  address: IAddress;
  location: IGeoPoint;
  service_area: string;
  license_file_url?: string;
  status?: CompanyStatus;
  rating_avg?: number;
  rating_count?: number;
  is_verified?: boolean;
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    email: { type: String, required: true },
    password_hash: { type: String, required: true },
    company_name: { type: String, required: true },
    director_name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    location: { type: GeoPointSchema, required: true },
    service_area: { type: String, required: true },
    license_file_url: { type: String },
    status: {
      type: String,
      enum: ['pending_verification', 'active', 'rejected', 'locked'],
    },
    rating_avg: { type: Number },
    rating_count: { type: Number },
    is_verified: { type: Boolean, default: false },
    last_login_at: { type: Date },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'companies',
  }
);

CompanySchema.index({ location: '2dsphere' });

export const Company = model<ICompany>('Company', CompanySchema);
