import { Company, ICompany } from '../models/Company.model';
class CompanyRepository {
  // Find company by email
  async findByEmail(email: string): Promise<ICompany | null> {
    return Company.findOne({ email }).exec();
  }

  // Create new company

  // Update last login time
  async updateById(companyId: string, updateData: Partial<ICompany>): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(companyId, updateData, { new: true }).exec();
  }

  // Find company by ID
  async findById(companyId: string): Promise<ICompany | null> {
    return Company.findById(companyId).exec();
  }
}

export default new CompanyRepository();
