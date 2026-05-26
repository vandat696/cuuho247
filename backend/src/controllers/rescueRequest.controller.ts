import { Request, Response, NextFunction } from 'express';
import rescueRequestService from '../services/rescueRequest.service';
import { createRequestSchema } from '../validators/rescueRequest.validator';

class RescueRequestController {
  async createRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = createRequestSchema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: error.details.map((err) => ({
            field: err.context?.key,
            message: err.message,
          })),
        });
        return;
      }

      // Bypass auth in dev: use a fixed ObjectId so create & cancel both share the same user
      const userId = (req as any).user?._id || req.body.user_id || '6652b2f9b1e8a001c8e4d2a1';

      const requestData = {
        ...value,
        user_id: userId,
      };

      const newRequest = await rescueRequestService.createRescueRequest(requestData);

      res.status(201).json({
        status: 'success',
        message: 'Tạo yêu cầu cứu hộ thành công',
        data: newRequest,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async cancelRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const userId = (req as any).user?._id || req.body.user_id || '6652b2f9b1e8a001c8e4d2a1'; // Fallback for dev

      const updatedRequest = await rescueRequestService.cancelRescueRequest(id, userId);

      res.status(200).json({
        status: 'success',
        message: 'Hủy yêu cầu thành công',
        data: updatedRequest,
      });
    } catch (error: any) {
      if (
        error.message.includes('không tồn tại') ||
        error.message.includes('quyền') ||
        error.message.includes('Chỉ có thể hủy')
      ) {
        res.status(400).json({ status: 'error', message: error.message });
        return;
      }
      next(error);
    }
  }
}

export default new RescueRequestController();
