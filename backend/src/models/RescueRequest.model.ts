import { Schema, model, Document, Types } from 'mongoose';
import type { IAddress, IGeoPoint } from './Company.model';

export type RequestStatus = 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected' | 'timeout';

export type ChangedBy = 'user' | 'company' | 'system' | 'admin';
export type CancelledBy = 'user' | 'company' | 'system';
export type PaymentMethod = 'cash' | 'bank_transfer' | 'e_wallet';

export interface IStatusHistory {
  status: string;
  changed_at?: Date;
  changed_by: ChangedBy;
  note?: string;
}

export interface IRequestCompany {
  company_id: Types.ObjectId;
  company_name?: string;
}

export interface IRequestVehicle {
  vehicle_id: Types.ObjectId;
  plate_number?: string;
}

export interface ICancellation {
  cancelled_by?: CancelledBy;
  reason?: string;
}

export interface IPayment {
  amount?: number;
  method?: PaymentMethod;
  paid_at?: Date;
}

export interface IRescueRequest extends Document {
  user_id: Types.ObjectId;
  company: IRequestCompany;
  vehicle: IRequestVehicle;
  description: string;
  location: IGeoPoint;
  service_types?: Types.ObjectId[];
  address?: Partial<IAddress>;
  incident_photos?: string[];
  status?: RequestStatus;
  status_history?: IStatusHistory[];
  response_deadline?: Date;
  eta_minutes?: number;
  accepted_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  cancelled_at?: Date;
  cancellation?: ICancellation;
  payment?: IPayment;
  created_at?: Date;
  updated_at?: Date;
}

const StatusHistorySchema = new Schema<IStatusHistory>(
  {
    status: { type: String, required: true },
    changed_at: { type: Date },
    changed_by: {
      type: String,
      enum: ['user', 'company', 'system', 'admin'],
      required: true,
    },
    note: { type: String },
  },
  { _id: false }
);

const RequestCompanySchema = new Schema<IRequestCompany>(
  {
    company_id: { type: Schema.Types.ObjectId, required: true },
    company_name: { type: String },
  },
  { _id: false }
);

const RequestVehicleSchema = new Schema<IRequestVehicle>(
  {
    vehicle_id: { type: Schema.Types.ObjectId, required: true },
    plate_number: { type: String },
  },
  { _id: false }
);

const CancellationSchema = new Schema<ICancellation>(
  {
    cancelled_by: { type: String, enum: ['user', 'company', 'system'] },
    reason: { type: String },
  },
  { _id: false }
);

const PaymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number },
    method: { type: String, enum: ['cash', 'bank_transfer', 'e_wallet'] },
    paid_at: { type: Date },
  },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    province: { type: String },
    district: { type: String },
    ward: { type: String },
    detail: { type: String },
  },
  { _id: false }
);

const GeoPointSchema = new Schema(
  {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  { _id: false }
);

const RescueRequestSchema = new Schema<IRescueRequest>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: RequestCompanySchema, required: true },
    vehicle: { type: RequestVehicleSchema, required: true },
    description: { type: String, required: true },
    location: { type: GeoPointSchema, required: true },
    service_types: [{ type: Schema.Types.ObjectId, ref: 'ServiceCategory' }],
    address: { type: AddressSchema },
    incident_photos: [{ type: String }],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected', 'timeout'],
    },
    status_history: [StatusHistorySchema],
    response_deadline: { type: Date },
    eta_minutes: { type: Number },
    accepted_at: { type: Date },
    started_at: { type: Date },
    completed_at: { type: Date },
    cancelled_at: { type: Date },
    cancellation: { type: CancellationSchema },
    payment: { type: PaymentSchema },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'rescue_requests',
  }
);

RescueRequestSchema.index({ user_id: 1 });
RescueRequestSchema.index({ 'company.company_id': 1 });
RescueRequestSchema.index({ status: 1 });
RescueRequestSchema.index({ location: '2dsphere' });

export const RescueRequest = model<IRescueRequest>('RescueRequest', RescueRequestSchema);
