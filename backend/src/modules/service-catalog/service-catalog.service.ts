import { NotFoundError, BadRequestError, ForbiddenError } from '@/shared/utils/apiError.util';
import { serviceRepository, serviceCategoryRepository } from './service-catalog.repository';
import type { CreateServiceInput } from './interfaces/service-catalog.interface';
import type { IService } from '@/shared/models/Service.model';
import type { IServiceCategory } from '@/shared/models/ServiceCategory.model';

class ServiceCatalogService {
  async getCategories(): Promise<IServiceCategory[]> {
    return serviceCategoryRepository.findAllActive();
  }

  async getServicesByCompany(companyId: string): Promise<IService[]> {
    if (!companyId) {
      throw new BadRequestError('Company ID là bắt buộc');
    }
    return serviceRepository.findByCompanyId(companyId);
  }

  async getServiceById(serviceId: string, companyId: string): Promise<IService> {
    if (!serviceId) {
      throw new BadRequestError('Service ID là bắt buộc');
    }
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundError('Dịch vụ không tồn tại');
    }
    // Verify the service belongs to the authenticated company
    if (service.company_id.toString() !== companyId) {
      throw new ForbiddenError('Không có quyền truy cập dịch vụ này');
    }
    return service;
  }

  async createService(serviceData: CreateServiceInput): Promise<IService> {
    // Check if duplicate service name for the same company
    const existingService = await serviceRepository.findByCompanyId(serviceData.company_id);
    if (existingService.some((s) => s.name === serviceData.name)) {
      throw new BadRequestError('Dịch vụ với tên này đã tồn tại cho công ty này');
    }

    // Create service
    return serviceRepository.create(serviceData);
  }

  async updateService(serviceId: string, companyId: string, updateData: Partial<IService>): Promise<IService | null> {
    if (!serviceId) {
      throw new BadRequestError('Service ID là bắt buộc');
    }

    // Verify the service belongs to the authenticated company
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundError('Dịch vụ không tồn tại');
    }
    if (service.company_id.toString() !== companyId) {
      throw new ForbiddenError('Không có quyền chỉnh sửa dịch vụ này');
    }

    // Check for duplicate service name if updating name
    if (updateData.name) {
      const existingService = await serviceRepository.findByCompanyId(companyId);
      if (existingService.some((s) => s.name === updateData.name && s._id.toString() !== serviceId)) {
        throw new BadRequestError('Dịch vụ với tên này đã tồn tại cho công ty này');
      }
    }

    return serviceRepository.updateById(serviceId, updateData);
  }

  async deleteService(serviceId: string, companyId: string): Promise<IService | null> {
    if (!serviceId) {
      throw new BadRequestError('Service ID là bắt buộc');
    }

    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new NotFoundError('Dịch vụ không tồn tại');
    }
    if (service.company_id.toString() !== companyId) {
      throw new ForbiddenError('Không có quyền xóa dịch vụ này');
    }

    return serviceRepository.deleteById(serviceId);
  }
}

export default new ServiceCatalogService();
