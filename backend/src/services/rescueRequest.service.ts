import { Types } from 'mongoose';
import rescueRequestRepository from '../repositories/rescueRequest.repository';
import companyRepository from '../repositories/company.repository';
import type { IRescueRequest } from '../models/RescueRequest.model';

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

class RescueRequestService {
  async getRequestsForUser(userId: string): Promise<IRescueRequest[]> {
    return rescueRequestRepository.findByUserId(userId);
  }

  async createRescueRequest(data: CreateRequestData): Promise<IRescueRequest> {
    const { user_id, company_id, description, location, address, service_types, incident_photos } = data;

    const company = await companyRepository.findById(company_id);
    if (!company) {
      throw new Error('Công ty cứu hộ không tồn tại');
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

    const newRequest = await rescueRequestRepository.create(payload);

    // TODO: Emit event via Socket.io when Socket server is setup
    // const io = getSocketServer();
    // if (io) {
    //   io.to(`company_${company_id}`).emit('rescueRequest:new', newRequest);
    // }

    return newRequest;
  }

  async cancelRescueRequest(requestId: string, userId: string): Promise<IRescueRequest> {
    const request = await rescueRequestRepository.findById(requestId);
    if (!request) {
      throw new Error('Yêu cầu không tồn tại');
    }

    if (request.user_id.toString() !== userId) {
      throw new Error('Bạn không có quyền hủy yêu cầu này');
    }

    if (request.status !== 'pending' && request.status !== 'accepted') {
      throw new Error('Chỉ có thể hủy khi yêu cầu đang ở trạng thái Chờ hoặc Đã nhận');
    }

    const updatedRequest = await rescueRequestRepository.updateStatus(
      requestId,
      'cancelled',
      'user',
      'Người dùng tự hủy',
      { cancelled_by: 'user' }
    );

    if (!updatedRequest) {
      throw new Error('Không thể cập nhật trạng thái yêu cầu');
    }

    // TODO: Gửi thông báo socket cho công ty để họ dừng xử lý
    // const io = getSocketServer();
    // if (io) {
    //   io.to(`company_${request.company.company_id.toString()}`).emit('rescueRequest:cancelled', updatedRequest);
    // }

    return updatedRequest;
  }
}

export default new RescueRequestService();
