/**
 * Auth Module – Public Contracts (Interfaces)
 *
 * Các module bên ngoài KHÔNG được import trực tiếp từ auth.service.ts.
 * Thay vào đó, họ phụ thuộc vào các interface này và nhận implementation
 * thông qua Dependency Injection tại app entry point.
 */

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
  service_area?: string;
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

export interface LoginResult {
  user: UserProfile | CompanyProfile;
  role: 'customer' | 'company';
  access_token: string;
}

// ─── Service Contract ──────────────────────────────────────────────────────────

/**
 * IAuthService: Contract chính của module Auth.
 * Bất kỳ implementation nào (AuthService, MockAuthService, ...) đều phải
 * thoả mãn interface này.
 */
export interface IAuthService {
  customerRegister(data: CustomerRegisterInput): Promise<UserProfile>;
  registerCompany(data: CompanyRegisterInput): Promise<CompanyProfile>;
  login(data: LoginInput): Promise<LoginResult>;
}
