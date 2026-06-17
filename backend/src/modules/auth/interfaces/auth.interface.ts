// ─── Input DTOs ────────────────────────────────────────────────────────────────

export interface CustomerRegisterInput {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
}

export interface CompanyRegisterInput {
  email: string;
  password: string;
  company_name: string;
  director_name: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  license_file_url?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// ─── Output DTOs ───────────────────────────────────────────────────────────────

export interface UserProfile {
  _id: string;
  email: string;
  full_name: string;
  phone?: string;
  status?: string;
}

export interface CompanyProfile {
  _id: string;
  email: string;
  company_name: string;
  director_name: string;
  status?: string;
}

export interface AdminProfile {
  _id: string;
  email: string;
  full_name: string;
}

export interface LoginResult {
  user: UserProfile | CompanyProfile | AdminProfile;
  role: 'customer' | 'company' | 'admin';
  access_token: string;
  refresh_token: string;
}
