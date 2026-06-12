/**
 * Service-Catalog Module – Public Contracts (Interfaces)
 *
 * Module này quản lý các Dịch vụ (Services) và Danh mục Dịch vụ (Service Categories)
 * mà các Công ty Cứu hộ cung cấp.
 */
import type { IService } from '@/shared/models/Service.model';
import type { IServiceCategory } from '@/shared/models/ServiceCategory.model';

// ─── Input DTOs ────────────────────────────────────────────────────────────────

export interface CreateServiceInput {
  company_id: string | any; // ObjectId | string (mongoose accepts both)
  category_id: string | any; // ObjectId | string
  name: string;
  description?: string;
  price: number;
  is_active?: boolean;
}

// ─── Repository Contracts ──────────────────────────────────────────────────────

export interface IServiceRepository {
  findByCompanyId(companyId: string): Promise<IService[]>;
  findByCompanyIdsAndCategory(companyIds: string[], categoryId?: string): Promise<IService[]>;
  findById(serviceId: string): Promise<IService | null>;
  create(data: Partial<IService>): Promise<IService>;
  updateById(serviceId: string, data: Partial<IService>): Promise<IService | null>;
  deleteById(serviceId: string): Promise<IService | null>;
}

export interface IServiceCategoryRepository {
  findBySlug(slug: string): Promise<IServiceCategory | null>;
  findBySlugs(slugs: string[]): Promise<IServiceCategory[]>;
  findAllActive(): Promise<IServiceCategory[]>;
}

// ─── Service Contract ──────────────────────────────────────────────────────────

export interface IServiceCatalogService {
  getServicesByCompany(companyId: string): Promise<IService[]>;
  getServiceById(serviceId: string, companyId: string): Promise<IService>;
  createService(data: CreateServiceInput): Promise<IService>;
  updateService(serviceId: string, companyId: string, data: Partial<IService>): Promise<IService | null>;
  deleteService(serviceId: string, companyId: string): Promise<IService | null>;
  getCategories(): Promise<IServiceCategory[]>;
}
