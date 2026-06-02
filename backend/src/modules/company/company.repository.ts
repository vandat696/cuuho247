import { Company, ICompany } from '@/shared/models/Company.model';
import type { ICompanyRepository } from './interfaces/company.interface';

/**
 * CompanyRepository: Implementation of ICompanyRepository.
 *
 * Đây là nơi DUY NHẤT chứa câu lệnh Mongoose cho Company.
 * Các module khác (auth, rescue) giao tiếp với module này
 * thông qua ICompanyRepository interface.
 */
class CompanyRepository implements ICompanyRepository {
  // Find company by email
  async findByEmail(email: string): Promise<ICompany | null> {
    return Company.findOne({ email }).exec();
  }

  // Create new company
  async create(companyData: Partial<ICompany>): Promise<ICompany> {
    return Company.create(companyData);
  }

  // Update last login time or any field
  async updateById(companyId: string, updateData: Partial<ICompany>): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(companyId, updateData, { new: true }).exec();
  }

  // Find company by ID
  async findById(companyId: string): Promise<ICompany | null> {
    return Company.findById(companyId).exec();
  }

  // Find companies nearby using geospatial query
  async findNearby(lng: number, lat: number, maxDistanceKm: number): Promise<ICompany[]> {
    return Company.find({
      status: 'active',
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: maxDistanceKm * 1000,
        },
      },
    })
      .select('-password_hash')
      .limit(20)
      .exec();
  }

  async findSearchable(): Promise<ICompany[]> {
    return Company.find({
      status: 'active',
      location: { $exists: true },
    })
      .select('-password_hash')
      .limit(20)
      .exec();
  }
}

const companyRepository = new CompanyRepository();
export default companyRepository;
