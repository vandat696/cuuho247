import { ServiceCategory, IServiceCategory } from '../models/ServiceCategory.model';

class ServiceCategoryRepository {
  async findBySlug(slug: string): Promise<IServiceCategory | null> {
    return ServiceCategory.findOne({
      slug,
      is_active: { $ne: false },
    }).exec();
  }

  async findAllActive(): Promise<IServiceCategory[]> {
    return ServiceCategory.find({ is_active: { $ne: false } }).exec();
  }
}

export default new ServiceCategoryRepository();
