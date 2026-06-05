import { Schema, model, Document } from 'mongoose';

export interface IServiceCategory extends Document {
  name: string;
  slug: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const ServiceCategorySchema = new Schema<IServiceCategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    is_active: { type: Boolean },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    collection: 'service_categories',
  }
);

ServiceCategorySchema.index({ slug: 1 }, { unique: true });

export const ServiceCategory = model<IServiceCategory>('ServiceCategory', ServiceCategorySchema);
