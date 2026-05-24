import { Types } from 'mongoose';
import { RescueRequest, IRescueRequest } from '../models/RescueRequest.model';

class RescueRequestRepository {
  async create(data: Partial<IRescueRequest>): Promise<IRescueRequest> {
    const request = new RescueRequest(data);
    return await request.save();
  }

  async findById(id: string): Promise<IRescueRequest | null> {
    return await RescueRequest.findById(id).lean();
  }

  async updateStatus(
    id: string,
    status: IRescueRequest['status'],
    changedBy: string,
    note?: string,
    cancellation?: IRescueRequest['cancellation']
  ): Promise<IRescueRequest | null> {
    const updateData: any = {
      $set: { status },
      $push: {
        status_history: {
          status,
          changed_by: changedBy,
          changed_at: new Date(),
          note,
        },
      },
    };

    if (status === 'cancelled') {
      updateData.$set.cancelled_at = new Date();
      if (cancellation) {
        updateData.$set.cancellation = cancellation;
      }
    } else if (status === 'accepted') {
      updateData.$set.accepted_at = new Date();
    } else if (status === 'in_progress') {
      updateData.$set.started_at = new Date();
    } else if (status === 'completed') {
      updateData.$set.completed_at = new Date();
    }

    return await RescueRequest.findByIdAndUpdate(id, updateData, { new: true }).lean();
  }
}

export default new RescueRequestRepository();
