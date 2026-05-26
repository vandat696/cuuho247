import { RescueRequest, IRescueRequest } from '../models/RescueRequest.model';
import type { CancelledBy } from '../models/RescueRequest.model';

class RescueRequestRepository {
  async findById(id: string): Promise<IRescueRequest | null> {
    return RescueRequest.findById(id);
  }

  async cancelById(id: string, cancelledBy: CancelledBy, reason: string): Promise<IRescueRequest | null> {
    return RescueRequest.findByIdAndUpdate(
      id,
      {
        status: 'cancelled',
        cancelled_at: new Date(),
        cancellation: {
          cancelled_by: cancelledBy,
          reason,
        },
        $push: {
          status_history: {
            status: 'cancelled',
            changed_at: new Date(),
            changed_by: cancelledBy,
            note: reason,
          },
        },
      },
      { new: true }
    );
  }
}

export default new RescueRequestRepository();
