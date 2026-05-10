import { Company, ICompany } from '../models/Company.model';
class CompanyRepository {
  // Find company by email
  async findByEmail(email: string): Promise<ICompany | null> {
    return Company.findOne({ email }).exec();
  }

  // Create new company
  async create(companyData: Partial<ICompany>): Promise<ICompany> {
    const newCompany = new Company(companyData);
    return newCompany.save();
  }

  // Update last login time
  async updateById(companyId: string, updateData: Partial<ICompany>): Promise<ICompany | null> {
    return Company.findByIdAndUpdate(companyId, updateData, { new: true }).exec();
  }
}
export default new CompanyRepository();