import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import rescueRequestService from '../services/rescueRequest.service';
import { cancelRequestSchema, createRequestSchema } from '../validators/rescueRequest.validator';

class RescueRequestController {
  async getMyRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requests = await rescueRequestService.getRequestsForUser(req.user.id);

      res.status(200).json({
        status: 'success',
        message: 'Lay danh sach yeu cau cuu ho cua ban thanh cong',
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
      const { error, value } = createRequestSchema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          status: 'error',
          message: 'Du lieu khong hop le',
          errors: error.details.map((err) => ({
            field: err.context?.key,
            message: err.message,
          })),
        });
        return;
      }

      const newRequest = await rescueRequestService.createRescueRequest({
        ...value,
        user_id: req.user.id,
      });

      res.status(201).json({
        status: 'success',
        message: 'Tao yeu cau cuu ho thanh cong',
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
        res.status(400).json({ status: 'error', message: error.details[0].message });
        return;
      }

      const updated = await rescueRequestService.cancelRequest(id, req.user.id, value.reason);

      res.status(200).json({
        status: 'success',
        message: 'Yeu cau cuu ho da duoc huy',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RescueRequestController();
