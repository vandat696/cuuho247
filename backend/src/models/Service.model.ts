import { Schema, model, Document, Types } from 'mongoose';

export interface IService extends Document {
  company_id: Types.ObjectId;
  category_id: Types.ObjectId;
  name: string;
  price: number;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    category_id: { type: Schema.Types.ObjectId, ref: 'ServiceCategory', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    is_active: { type: Boolean },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'services',
  }
);

ServiceSchema.index({ company_id: 1 });
ServiceSchema.index({ category_id: 1 });

export const Service = model<IService>('Service', ServiceSchema);
