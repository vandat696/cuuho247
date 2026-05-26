import { IRescueRequest } from '../models/RescueRequest.model';
import rescueRequestRepository from '../repositories/rescueRequest.repository';
import { ApiError } from '../utils/apiError.util';

const CANCELLABLE_STATUSES = ['pending', 'accepted'] as const;

class RescueRequestService {
  async cancelRequest(requestId: string, userId: string, reason: string): Promise<IRescueRequest> {
    // Verify request existence
    const request = await rescueRequestRepository.findById(requestId);
    if (!request) {
      throw new ApiError(404, 'Không tìm thấy yêu cầu cứu hộ');
    }

    // Check ownership
    if (request.user_id.toString() !== userId) {
      throw new ApiError(403, 'Bạn không có quyền hủy yêu cầu này');
    }

    // Validate request status eligibility for cancellation
    if (!CANCELLABLE_STATUSES.includes(request.status as any)) {
      throw new ApiError(400, 'Không thể hủy yêu cầu ở trạng thái hiện tại');
    }

    // Cancel
    const updated = await rescueRequestRepository.cancelById(requestId, 'user', reason);
    if (!updated) {
      throw new ApiError(500, 'Hủy yêu cầu thất bại, vui lòng thử lại');
    }

    return updated;
  }
}

export default new RescueRequestService();
