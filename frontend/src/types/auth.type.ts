import { User, Company } from './common.type';

export type AuthRole = 'customer' | 'company';

// Login Data Type
export interface LoginData {
  user: User | Company;
  role: AuthRole;
  access_token: string;
}

// Register Data Type
export type CustomerRegisterData = User;

// export type CompanyRegisterData = Company;
