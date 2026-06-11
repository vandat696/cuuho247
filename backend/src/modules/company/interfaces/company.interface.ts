/**
 * Company Module – Public Contracts (Interfaces)
 *
 * Các module khác (auth, rescue, service-catalog) sẽ phụ thuộc vào
 * ICompanyRepository thay vì import trực tiếp company.repository.ts.
 * Điều này cho phép hoán đổi implementation mà không ảnh hưởng đến
 * các module phụ thuộc.
 */
import type { ICompany } from '@/shared/models/Company.model';

// ─── Repository Contract ───────────────────────────────────────────────────────

/**
 * ICompanyRepository: Hợp đồng truy cập dữ liệu của module Company.
 * Các module khác chỉ nên dùng interface này, không dùng class cụ thể.
 */
export interface ICompanyRepository {
  findById(id: string): Promise<ICompany | null>;
  findByEmail(email: string): Promise<ICompany | null>;
  findNearby(lng: number, lat: number, maxDistanceKm: number): Promise<ICompany[]>;
  findSearchable(): Promise<ICompany[]>;
  create(data: Partial<ICompany>): Promise<ICompany>;
  updateById(id: string, data: Partial<ICompany>): Promise<ICompany | null>;
}

// ─── Service Contract ──────────────────────────────────────────────────────────

export interface UpdateCompanyProfileInput {
  company_name?: string;
  director_name?: string;
  phone?: string;
  address?: {
    province?: string;
    district?: string;
    ward?: string;
    detail?: string;
  };
  location?: {
    coordinates: [number, number];
  };
  license_url?: string;
}

export interface ICompanyService {
  getCompanyById(companyId: string): Promise<Omit<ICompany, 'password_hash'>>;
  updateCompanyProfile(companyId: string, data: UpdateCompanyProfileInput): Promise<Omit<ICompany, 'password_hash'>>;
}
