import { ApiError } from '@/shared/utils/apiError.util';
import companyRepository from './company.repository';
import type { ICompanyService } from './interfaces/company.interface';
import type { ICompany } from '@/shared/models/Company.model';

/**
 * CompanyService: Xử lý business logic của module Company.
 *
 * Trước đây controller gọi thẳng repository (vi phạm nguyên tắc).
 * Bây giờ controller → service → repository.
 */
class CompanyService implements ICompanyService {
  async getCompanyById(companyId: string): Promise<Omit<ICompany, 'password_hash'>> {
    if (!companyId) {
      throw new ApiError(400, 'Company ID is required');
    }

    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new ApiError(404, 'Company not found');
    }

    const { password_hash: _passwordHash, ...companyData } = company.toObject();
    return companyData as Omit<ICompany, 'password_hash'>;
  }
}

export default new CompanyService();
