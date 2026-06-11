import { Types } from 'mongoose';
import companyRepository from '@/modules/company/company.repository';
import rescueRepository from './rescue.repository';
import type { IRescueRequest, RequestStatus } from '@/shared/models/RescueRequest.model';
import { ApiError } from '@/shared/utils/apiError.util';
import { ServiceCategory } from '@/shared/models/ServiceCategory.model';
import { mapIncidentTypesToCategories } from '@/shared/constants/incidentMapping';
import type { IRescueCustomerService, CreateRequestData } from './interfaces/rescue.interface';

const CANCELLABLE_STATUSES: RequestStatus[] = ['pending', 'accepted'];

/**
 * RescueCustomerService: Xử lý nghiệp vụ Cứu hộ từ phía Khách hàng.
 *
 * Giao tiếp với module Company thông qua companyRepository (ICompanyRepository).
 * Giao tiếp với Database thông qua rescueRepository (IRescueRepository).
 */
class RescueCustomerService implements IRescueCustomerService {
  async getRequestsForUser(userId: string): Promise<IRescueRequest[]> {
    return rescueRepository.findByUserId(userId);
  }

  async createRescueRequest(data: CreateRequestData): Promise<IRescueRequest> {
    const { user_id, company_id, description, location, address, service_types, incident_photos } = data;

    const company = await companyRepository.findById(company_id);
    if (!company) {
      throw new ApiError(404, 'Công ty cứu hộ không tồn tại');
    }

    const payload: Partial<IRescueRequest> = {
      user_id: new Types.ObjectId(user_id),
      company: {
        company_id: new Types.ObjectId(company_id),
        company_name: company.company_name,
      },
      description,
      location: {
        type: 'Point',
        coordinates: [location.lng, location.lat],
      },
      incident_type: service_types?.[0],
      status: 'pending',
      status_history: [
        {
          status: 'pending',
          changed_by: 'user',
          changed_at: new Date(),
        },
      ],
    };

    if (address) {
      payload.address = { detail: address };
    }

    if (service_types && service_types.length > 0) {
      const mappedCategorySlugs = mapIncidentTypesToCategories(service_types);
      const categories = await ServiceCategory.find({ slug: { $in: mappedCategorySlugs } });
      if (categories.length > 0) {
        payload.service_types = categories.map((cat) => cat._id as Types.ObjectId);
      }
    }

    if (incident_photos && incident_photos.length > 0) {
      payload.incident_photos = incident_photos;
    }

    return rescueRepository.create(payload);
  }

  async cancelRequest(requestId: string, userId: string, reason: string): Promise<IRescueRequest> {
    const request = await rescueRepository.findById(requestId);
    if (!request) {
      throw new ApiError(404, 'Không tìm thấy yêu cầu cứu hộ');
    }

    if (request.user_id.toString() !== userId) {
      throw new ApiError(403, 'Bạn không có quyền hủy yêu cầu này');
    }

    if (!request.status || !CANCELLABLE_STATUSES.includes(request.status)) {
      throw new ApiError(400, 'Không thể hủy yêu cầu ở trạng thái hiện tại');
    }

    const updated = await rescueRepository.cancelById(requestId, 'user', reason);
    if (!updated) {
      throw new ApiError(500, 'Hủy yêu cầu thất bại, vui lòng thử lại');
    }

    return updated;
  }
}

export default new RescueCustomerService();
