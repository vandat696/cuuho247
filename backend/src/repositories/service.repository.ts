import { Service, IService } from '../models/Service.model';

class ServiceRepository {
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

export default new ServiceRepository();
