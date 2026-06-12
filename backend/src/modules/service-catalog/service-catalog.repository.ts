import { Service, IService } from '@/shared/models/Service.model';
import { ServiceCategory, IServiceCategory } from '@/shared/models/ServiceCategory.model';
import type { IServiceRepository, IServiceCategoryRepository } from './interfaces/service-catalog.interface';

class ServiceRepository implements IServiceRepository {
  async findByCompanyIdsAndCategory(companyIds: string[], categoryId?: string): Promise<IService[]> {
    const query: Record<string, unknown> = {
      company_id: { $in: companyIds },
      is_active: { $ne: false },
    };

    if (categoryId) {
      query.category_id = categoryId;
    }

    return Service.find(query).select('company_id name price').exec();
  }

  // Create new service
  async create(serviceData: Partial<IService>): Promise<IService> {
    const service = new Service(serviceData);
    return service.save();
  }

  // Find service by ID
  async findById(serviceId: string): Promise<IService | null> {
    return Service.findById(serviceId).populate('category_id', 'name').exec();
  }

  // Find services by company ID
  async findByCompanyId(companyId: string): Promise<IService[]> {
    return Service.find({ company_id: companyId }).exec();
  }

  // Update service
  async updateById(serviceId: string, updateData: Partial<IService>): Promise<IService | null> {
    return Service.findByIdAndUpdate(serviceId, updateData, { new: true }).populate('category_id', 'name').exec();
  }

  // Delete service
  async deleteById(serviceId: string): Promise<IService | null> {
    return Service.findByIdAndDelete(serviceId).exec();
  }
}

class ServiceCategoryRepository implements IServiceCategoryRepository {
  async findBySlug(slug: string): Promise<IServiceCategory | null> {
    return ServiceCategory.findOne({
      slug,
      is_active: { $ne: false },
    }).exec();
  }

  async findBySlugs(slugs: string[]): Promise<IServiceCategory[]> {
    return ServiceCategory.find({
      slug: { $in: slugs },
      is_active: { $ne: false },
    }).exec();
  }

  async findAllActive(): Promise<IServiceCategory[]> {
    return ServiceCategory.find({ is_active: { $ne: false } }).exec();
  }
}

export const serviceRepository = new ServiceRepository();
export const serviceCategoryRepository = new ServiceCategoryRepository();
