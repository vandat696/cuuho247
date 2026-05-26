import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import rescueRequestService from '../services/rescueRequest.service';
import { cancelRequestSchema } from '../validators/rescueRequest.validator';

class RescueRequestController {
  async cancelRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      // Validate body
      const { error, value } = cancelRequestSchema.validate(req.body);
      if (error) {
        res.status(400).json({ status: 'error', message: error.details[0].message });
        return;
      }

      const updated = await rescueRequestService.cancelRequest(id, userId, value.reason);

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

export default new RescueRequestController();
