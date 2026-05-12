import { Service, IService } from '../models/Service.model';

class ServiceRepository {
  async findByCompanyIdsAndCategory(companyIds: string[], categoryId?: string): Promise<IService[]> {
    const query: any = {
      company_id: { $in: companyIds },
      is_active: { $ne: false },
    };

    if (categoryId) {
      query.category_id = categoryId;
    }

    return Service.find(query).select('company_id name').exec();
  }

  async findByCompanyId(companyId: string): Promise<IService[]> {
    return Service.find({ company_id: companyId, is_active: { $ne: false } }).exec();
  }
}

export default new ServiceRepository();
