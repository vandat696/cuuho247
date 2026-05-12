export interface Service {
  _id: string;
  company_id: string;
  category_id: string;
  name: string;
  price: number;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ServiceCategory {
  _id: string;
  name: string;
  slug: string;
  icon_url?: string;
  is_active?: boolean;
}

export interface ServiceFormData {
  category_id: string;
  name: string;
  price: number;
  description?: string;
  is_active?: boolean;
}

export type ServiceFormErrors = Partial<Record<keyof ServiceFormData, string>>;
