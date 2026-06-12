import { BadRequestError, NotFoundError, InternalServerError } from '@/shared/utils/apiError.util';
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
      throw new BadRequestError('Company ID is required');
    }

    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    const { password_hash: _passwordHash, ...companyData } = company.toObject();
    return companyData as Omit<ICompany, 'password_hash'>;
  }

  async updateCompanyProfile(
    companyId: string,
    data: import('./interfaces/company.interface').UpdateCompanyProfileInput
  ): Promise<Omit<ICompany, 'password_hash'>> {
    if (!companyId) {
      throw new BadRequestError('Company ID is required');
    }

    const company = await companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company not found');
    }

    // Set status to pending verification as per requirements
    // Also clear any previous admin reason messages when company re-submits
    const updateData: any = {
      ...data,
      status: 'pending_verification',
      is_verified: false,
      rejection_reason: null,
      document_request_reason: null,
    };

    if (typeof data.address === 'string') {
      updateData.address = {
        province: 'Chưa cập nhật',
        district: 'Chưa cập nhật',
        ward: 'Chưa cập nhật',
        detail: data.address,
      };
    }

    if (data.location?.coordinates) {
      updateData.location = {
        type: 'Point',
        coordinates: data.location.coordinates,
      };
    }

    if (data.license_url) {
      updateData.license_file_url = data.license_url;
      delete updateData.license_url;
    }

    const updatedCompany = await companyRepository.updateById(companyId, updateData);
    if (!updatedCompany) {
      throw new InternalServerError('Failed to update company profile');
    }

    const { password_hash: _passwordHash, ...companyData } = updatedCompany.toObject();
    return companyData as Omit<ICompany, 'password_hash'>;
  }
}

export default new CompanyService();
