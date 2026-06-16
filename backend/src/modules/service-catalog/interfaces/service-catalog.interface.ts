export interface CreateServiceInput {
  company_id: string | any; // ObjectId | string (mongoose accepts both)
  category_id: string | any; // ObjectId | string
  name: string;
  description?: string;
  price: number;
  is_active?: boolean;
}
