import { Types } from 'mongoose';
import companyRepository from '../repositories/company.repository';
import rescueRequestRepository from '../repositories/rescueRequestCustomer.repository';
import type { IRescueRequest, RequestStatus } from '../models/RescueRequest.model';
import { ApiError } from '../utils/apiError.util';

export interface CreateRequestData {
  user_id: string;
  company_id: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  service_types?: string[];
  incident_photos?: string[];
}

const CANCELLABLE_STATUSES: RequestStatus[] = ['pending', 'accepted'];

class RescueRequestService {
  async getRequestsForUser(userId: string): Promise<IRescueRequest[]> {
    return rescueRequestRepository.findByUserId(userId);
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
      payload.service_types = service_types.map((id) => new Types.ObjectId(id));
    }

    if (incident_photos && incident_photos.length > 0) {
      payload.incident_photos = incident_photos;
    }

    return rescueRequestRepository.create(payload);
  }

  async cancelRequest(requestId: string, userId: string, reason: string): Promise<IRescueRequest> {
    const request = await rescueRequestRepository.findById(requestId);
    if (!request) {
      throw new ApiError(404, 'Không tìm thấy yêu cầu cứu hộ');
    }

    if (request.user_id.toString() !== userId) {
      throw new ApiError(403, 'Bạn không có quyền hủy yêu cầu này');
    }

    if (!request.status || !CANCELLABLE_STATUSES.includes(request.status)) {
      throw new ApiError(400, 'Không thể hủy yêu cầu ở trạng thái hiện tại');
    }

    const updated = await rescueRequestRepository.cancelById(requestId, 'user', reason);
    if (!updated) {
      throw new ApiError(500, 'Hủy yêu cầu thất bại, vui lòng thử lại');
    }

    return updated;
  }
}

export default new RescueRequestService();
