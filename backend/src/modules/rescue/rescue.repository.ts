import { RescueRequest, IRescueRequest } from '@/shared/models/RescueRequest.model';
import type { CancelledBy, ChangedBy, ICancellation, RequestStatus } from '@/shared/models/RescueRequest.model';
import { Types } from 'mongoose';

/**
 * RescueRepository: Implementation of IRescueRepository.
 * Đây là nơi DUY NHẤT chứa câu lệnh Mongoose cho RescueRequest.
 */
class RescueRepository {
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

  async findPendingRequestsByCompany(companyId: string): Promise<any[]> {
    return RescueRequest.find({
      'company.company_id': companyId,
      status: 'pending',
    })
      .populate('service_types', 'name slug')
      .sort({ created_at: -1 })
      .lean()
      .exec();
  }

  async findActiveRequestsByCompany(companyId: string): Promise<any[]> {
    return RescueRequest.find({
      'company.company_id': companyId,
      status: { $in: ['accepted', 'in_progress'] },
    })
      .populate('service_types', 'name slug')
      .sort({ started_at: -1, accepted_at: -1, created_at: -1 })
      .lean()
      .exec();
  }

  async findCompletedRequestsByCompany(companyId: string): Promise<any[]> {
    return RescueRequest.find({
      'company.company_id': companyId,
      status: 'completed',
    })
      .populate('service_types', 'name slug')
      .sort({ completed_at: -1, updated_at: -1, created_at: -1 })
      .lean()
      .exec();
  }

  async findCanceledRequestsByCompany(companyId: string): Promise<any[]> {
    return RescueRequest.find({
      'company.company_id': companyId,
      status: 'cancelled',
    })
      .populate('service_types', 'name slug')
      .sort({ cancelled_at: -1, updated_at: -1, created_at: -1 })
      .lean()
      .exec();
  }

  async findDetail(companyId: string, requestId: string, statusFilter: string | string[]): Promise<any | null> {
    const query: any = {
      _id: requestId,
      'company.company_id': companyId,
    };

    if (Array.isArray(statusFilter)) {
      query.status = { $in: statusFilter };
    } else {
      query.status = statusFilter;
    }

    return RescueRequest.findOne(query)
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec();
  }

  async acceptPendingRequest(
    companyId: string,
    requestId: string,
    vehicleId: string,
    plateNumber: string,
    etaMinutes: number,
    note?: string
  ): Promise<any | null> {
    const acceptedAt = new Date();
    return RescueRequest.findOneAndUpdate(
      {
        _id: requestId,
        'company.company_id': companyId,
        status: 'pending',
      },
      {
        $set: {
          status: 'accepted',
          vehicle: {
            vehicle_id: new Types.ObjectId(vehicleId),
            plate_number: plateNumber,
          },
          eta_minutes: etaMinutes,
          accepted_at: acceptedAt,
        },
        $push: {
          status_history: {
            status: 'accepted',
            changed_by: 'company',
            changed_at: acceptedAt,
            note: note || `Du kien den trong ${etaMinutes} phut`,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec();
  }

  async startActiveRequest(companyId: string, requestId: string): Promise<any | null> {
    const startedAt = new Date();
    return RescueRequest.findOneAndUpdate(
      {
        _id: requestId,
        'company.company_id': companyId,
        status: 'accepted',
      },
      {
        $set: {
          status: 'in_progress',
          started_at: startedAt,
        },
        $push: {
          status_history: {
            status: 'in_progress',
            changed_by: 'company',
            changed_at: startedAt,
            note: 'Bắt đầu di chuyển',
          },
        },
      },
      { new: true, runValidators: true }
    )
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec();
  }

  async arriveActiveRequest(companyId: string, requestId: string): Promise<any | null> {
    const arrivedAt = new Date();
    return RescueRequest.findOneAndUpdate(
      {
        _id: requestId,
        'company.company_id': companyId,
        status: 'in_progress',
      },
      {
        $set: {
          status: 'arrived',
          arrived_at: arrivedAt,
        },
        $push: {
          status_history: {
            status: 'arrived',
            changed_by: 'company',
            changed_at: arrivedAt,
            note: 'Xe đã đến nơi',
          },
        },
      },
      { new: true, runValidators: true }
    )
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec();
  }

  async completeActiveRequest(
    companyId: string,
    requestId: string,
    amount: number,
    method?: string,
    note?: string
  ): Promise<any | null> {
    const completedAt = new Date();
    return RescueRequest.findOneAndUpdate(
      {
        _id: requestId,
        'company.company_id': companyId,
        status: { $in: ['accepted', 'in_progress', 'arrived'] },
      },
      {
        $set: {
          status: 'completed',
          completed_at: completedAt,
          payment: {
            amount: amount,
            method: method || 'cash',
            paid_at: completedAt,
          },
        },
        $push: {
          status_history: {
            status: 'completed',
            changed_by: 'company',
            changed_at: completedAt,
            note: note || `Thanh toán thực tế: ${amount}`,
          },
        },
      },
      { new: true, runValidators: true }
    )
      .populate('user_id', 'full_name phone')
      .populate('service_types', 'name slug')
      .lean()
      .exec();
  }

  async findActiveRequestByVehicle(vehicleId: string): Promise<any | null> {
    return RescueRequest.findOne({
      'vehicle.vehicle_id': vehicleId,
      status: { $in: ['pending', 'accepted', 'in_progress'] },
    })
      .lean()
      .exec();
  }
}

export default new RescueRepository();
