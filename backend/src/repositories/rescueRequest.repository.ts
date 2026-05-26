import { RescueRequest, IRescueRequest } from '../models/RescueRequest.model';
import type { CancelledBy, ChangedBy, ICancellation, RequestStatus } from '../models/RescueRequest.model';

class RescueRequestRepository {
  async create(data: Partial<IRescueRequest>): Promise<IRescueRequest> {
    return RescueRequest.create(data);
  }

  async findById(id: string): Promise<IRescueRequest | null> {
    return RescueRequest.findById(id);
  }

  async findByUserId(userId: string): Promise<IRescueRequest[]> {
    return RescueRequest.find({ user_id: userId }).sort({ created_at: -1 });
  }

  async updateStatus(
    id: string,
    status: RequestStatus,
    changedBy: ChangedBy,
    note?: string,
    cancellation?: ICancellation
  ): Promise<IRescueRequest | null> {
    const changedAt = new Date();
    const updateData: any = {
      $set: { status },
      $push: {
        status_history: {
          status,
          changed_by: changedBy,
          changed_at: changedAt,
          note,
        },
      },
    };

    if (status === 'cancelled') {
      updateData.$set.cancelled_at = changedAt;
      if (cancellation) {
        updateData.$set.cancellation = cancellation;
      }
    } else if (status === 'accepted') {
      updateData.$set.accepted_at = changedAt;
    } else if (status === 'in_progress') {
      updateData.$set.started_at = changedAt;
    } else if (status === 'completed') {
      updateData.$set.completed_at = changedAt;
    }

    return RescueRequest.findByIdAndUpdate(id, updateData, { new: true });
  }

  async cancelById(id: string, cancelledBy: CancelledBy, reason: string): Promise<IRescueRequest | null> {
    return this.updateStatus(id, 'cancelled', cancelledBy, reason, {
      cancelled_by: cancelledBy,
      reason,
    });
  }
}

export default new RescueRequestRepository();
