import { Schema, model, Document, Types } from 'mongoose';

export type VehicleStatus = 'available' | 'unavailable';

export interface IVehicle extends Document {
  company_id: Types.ObjectId;
  plate_number: string;
  vehicle_type: string;
  status?: VehicleStatus;
  created_at?: Date;
  updated_at?: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    plate_number: { type: String, required: true },
    vehicle_type: { type: String, required: true },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'vehicles',
  }
);

VehicleSchema.index({ company_id: 1 });
VehicleSchema.index({ plate_number: 1 }, { unique: true });

export const Vehicle = model<IVehicle>('Vehicle', VehicleSchema);
