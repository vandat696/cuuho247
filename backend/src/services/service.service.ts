import serviceRepository from '@/repositories/service.repository';
import { ApiError } from '@/utils/apiError.util';

class ServiceService {
  async getServicesByCompany(companyId: string) {
    if (!companyId) {
      throw new ApiError(400, 'Company ID là bắt buộc');
    }
    const services = await serviceRepository.findByCompanyId(companyId);
    return services;
  }

  async getServiceById(serviceId: string, companyId: string) {
    if (!serviceId) {
      throw new ApiError(400, 'Service ID là bắt buộc');
    }
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new ApiError(404, 'Dịch vụ không tồn tại');
    }
    // Verify the service belongs to the authenticated company
    if (service.company_id.toString() !== companyId) {
      throw new ApiError(403, 'Không có quyền truy cập dịch vụ này');
    }
    return service;
  }

  async createService(serviceData: any) {
    // Check if duplicate service name for the same company
    const existingService = await serviceRepository.findByCompanyId(serviceData.company_id);
    if (existingService.some((s) => s.name === serviceData.name)) {
      throw new ApiError(400, 'Dịch vụ với tên này đã tồn tại cho công ty này');
    }

    // Create service
    const service = await serviceRepository.create(serviceData);
    return service;
  }

  async updateService(serviceId: string, companyId: string, updateData: any) {
    if (!serviceId) {
      throw new ApiError(400, 'Service ID là bắt buộc');
    }

    // Verify the service belongs to the authenticated company
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new ApiError(404, 'Dịch vụ không tồn tại');
    }
    if (service.company_id.toString() !== companyId) {
      throw new ApiError(403, 'Không có quyền chỉnh sửa dịch vụ này');
    }

    // Check for duplicate service name if updating name
    if (updateData.name) {
      const existingService = await serviceRepository.findByCompanyId(companyId);
      if (existingService.some((s) => s.name === updateData.name && s._id.toString() !== serviceId)) {
        throw new ApiError(400, 'Dịch vụ với tên này đã tồn tại cho công ty này');
      }
    }

    // Update service
    const updatedService = await serviceRepository.updateById(serviceId, updateData);
    return updatedService;
  }

  async deleteService(serviceId: string, companyId: string) {
    if (!serviceId) {
      throw new ApiError(400, 'Service ID là bắt buộc');
    }

    // Verify the service belongs to the authenticated company
    const service = await serviceRepository.findById(serviceId);
    if (!service) {
      throw new ApiError(404, 'Dịch vụ không tồn tại');
    }
    if (service.company_id.toString() !== companyId) {
      throw new ApiError(403, 'Không có quyền xóa dịch vụ này');
    }

    // Delete service
    const deletedService = await serviceRepository.deleteById(serviceId);
    return deletedService;
  }
}

export default new ServiceService();
