import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import rescueRequestService from './customer.service';
import { cancelRequestSchema, createRequestSchema } from './rescue.validator';
import { validateSchema } from '../../shared/utils/validation.util';
import { BadRequestError } from '../../shared/utils/apiError.util';
import { rescueEventEmitter, RESCUE_EVENTS } from './rescue.event';

class RescueCustomerController {
  async getMyRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requests = await rescueRequestService.getRequestsForUser(req.user.id);

      res.status(200).json({
        status: 'success',
        message: 'Lấy danh sách yêu cầu cứu hộ của bạn thành công',
        data: {
          total: requests.length,
          requests,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const value = validateSchema<any>(createRequestSchema, req.body, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
        formatErrors: 'object',
      });

      const newRequest = await rescueRequestService.createRescueRequest({
        ...value,
        user_id: req.user.id,
      });

      // Emit domain event for side-effects (Socket.io & Notifications)
      rescueEventEmitter.emit(RESCUE_EVENTS.REQUEST_CREATED, {
        request: newRequest,
        io: req.app.get('io'),
      });

      res.status(201).json({
        status: 'success',
        message: 'Tạo yêu cầu cứu hộ thành công',
        data: newRequest,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = cancelRequestSchema.validate(req.body);
      if (error) {
        throw new BadRequestError(error.details[0].message);
      }

      const updated = await rescueRequestService.cancelRequest(id, req.user.id, value.reason);

      // Emit domain event for side-effects (Socket.io & Notifications)
      rescueEventEmitter.emit(RESCUE_EVENTS.REQUEST_CANCELLED, {
        request: updated,
        userId: req.user.id,
        reason: value.reason,
        io: req.app.get('io'),
      });

      res.status(200).json({
        status: 'success',
        message: 'Yêu cầu cứu hộ đã được hủy',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RescueCustomerController();
