import { Schema } from 'mongoose';

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface IAddress {
  province: string;
  district: string;
  ward: string;
  detail?: string;
}

export interface IGeoPoint {
  type: 'Point';
  coordinates: number[]; // [longitude, latitude]
}

// ─── Sub-document Schemas ──────────────────────────────────────────────────────

export const AddressSchema = new Schema<IAddress>(
  {
    province: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    detail: { type: String },
  },
  { _id: false }
);

export const GeoPointSchema = new Schema<IGeoPoint>(
  {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);
