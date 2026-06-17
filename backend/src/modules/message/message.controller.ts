import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { messageService } from './message.service';
import { UnauthorizedError, BadRequestError } from '@/shared/utils/apiError.util';

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
        throw new UnauthorizedError('Chưa xác thực');
      }

      const { messages, rescueRequest } = await messageService.getMessages(userId, userRole, rescueRequestId);

      res.status(200).json({
        status: 'success',
        data: {
          messages,
          rescue_request: rescueRequest,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/messages/:rescueRequestId/image
   * Upload and send an image in chat
   */
  async sendImage(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rescueRequestId } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      if (!userId) {
        throw new UnauthorizedError('Chưa xác thực');
      }

      if (!req.file) {
        throw new BadRequestError('Vui lòng chọn ảnh');
      }

      const io = req.app.get('io');
      const message = await messageService.sendImage(userId, userRole, rescueRequestId, req.file.path, io);

      const messageData = {
        _id: message._id,
        rescue_request_id: message.rescue_request_id,
        sender_type: message.sender_type,
        sender_id: message.sender_id,
        content: message.content,
        content_type: message.content_type,
        is_read: message.is_read,
        created_at: message.created_at,
      };

      res.status(201).json({
        status: 'success',
        data: messageData,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
