import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { Message } from '@/shared/models/Message.model';
import { RescueRequest } from '@/shared/models/RescueRequest.model';
import { hasRequestAccess } from '@/shared/utils/rescueRequestAuth';

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
      const rescueRequest = await RescueRequest.findById(rescueRequestId).populate('user_id', 'full_name');
      if (!rescueRequest) {
        res.status(404).json({ status: 'error', message: 'Yêu cầu cứu hộ không tồn tại' });
        return;
      }

      if (!hasRequestAccess(rescueRequest, userId, userRole)) {
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
            customer_name: (rescueRequest.user_id as any)?.full_name || 'Khách hàng',
            status: rescueRequest.status,
          },
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
        res.status(401).json({ status: 'error', message: 'Chưa xác thực' });
        return;
      }

      if (!req.file) {
        res.status(400).json({ status: 'error', message: 'Vui lòng chọn ảnh' });
        return;
      }

      const rescueRequest = await RescueRequest.findById(rescueRequestId);
      if (!rescueRequest) {
        res.status(404).json({ status: 'error', message: 'Yêu cầu cứu hộ không tồn tại' });
        return;
      }

      if (!hasRequestAccess(rescueRequest, userId, userRole)) {
        res.status(403).json({ status: 'error', message: 'Không có quyền truy cập cuộc trò chuyện này' });
        return;
      }

      if (
        rescueRequest.status === 'completed' ||
        rescueRequest.status === 'cancelled' ||
        rescueRequest.status === 'rejected'
      ) {
        res.status(400).json({
          status: 'error',
          message: 'Không thể gửi tin nhắn do yêu cầu cứu hộ đã kết thúc hoặc bị hủy',
        });
        return;
      }

      const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      const senderType = userRole === 'company' ? 'company' : 'user';

      const message = await Message.create({
        rescue_request_id: rescueRequestId,
        sender_type: senderType,
        sender_id: userId,
        content: imageUrl,
        content_type: 'image',
        is_read: false,
      });

      const messageData = {
        _id: message._id,
        rescue_request_id: rescueRequestId,
        sender_type: senderType,
        sender_id: userId,
        content: message.content,
        content_type: message.content_type,
        is_read: message.is_read,
        created_at: message.created_at,
      };

      // Broadcast to socket room
      const io = req.app.get('io');
      if (io) {
        const room = `chat:${rescueRequestId}`;
        io.to(room).emit('receive_message', messageData);
        console.log(`[Socket] Image message saved & sent to room ${room}`);
      } else {
        console.warn('[Socket] Socket.IO instance not found on app, fallback to DB only');
      }

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
