import { User, Company } from './common.type';

// Login Data Type
export interface LoginData {
  user: User | Company;
  role: 'customer' | 'company';
  access_token: string;
}

// Register Data Type
export type CustomerRegisterData = User;

// export type CompanyRegisterData = Company;
