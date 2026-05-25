import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { Message } from '../models/Message.model';
import { RescueRequest } from '../models/RescueRequest.model';

class MessageController {
  /**
   * GET /api/messages/:rescueRequestId
   * Fetch message history for a rescue request
   */
  async getMessages(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rescueRequestId } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId) {
        res.status(401).json({ status: 'error', message: 'Chưa xác thực' });
        return;
      }

      // Verify user has access to this rescue request
      const rescueRequest = await RescueRequest.findById(rescueRequestId).lean();
      if (!rescueRequest) {
        res.status(404).json({ status: 'error', message: 'Yêu cầu cứu hộ không tồn tại' });
        return;
      }

      const isCustomer = userRole === 'user' && rescueRequest.user_id.toString() === userId;
      const isCompany = userRole === 'company' && rescueRequest.company.company_id.toString() === userId;

      if (!isCustomer && !isCompany) {
        res.status(403).json({ status: 'error', message: 'Không có quyền truy cập cuộc trò chuyện này' });
        return;
      }

      const messages = await Message.find({ rescue_request_id: rescueRequestId }).sort({ created_at: 1 }).lean();

      res.status(200).json({
        status: 'success',
        data: {
          messages,
          rescue_request: {
            _id: rescueRequest._id,
            company_name: rescueRequest.company.company_name,
            status: rescueRequest.status,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
