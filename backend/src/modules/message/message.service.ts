import { messageRepository } from './message.repository';
import rescueRepository from '../rescue/rescue.repository';
import { hasRequestAccess } from '@/shared/utils/rescueRequestAuth';
import { UnauthorizedError, NotFoundError, ForbiddenError, BadRequestError } from '@/shared/utils/apiError.util';
import { messageEventEmitter, MESSAGE_EVENTS } from './message.event';
import type { IMessage } from '@/shared/models/Message.model';

class MessageService {
  async getMessages(
    userId: string,
    userRole: string,
    rescueRequestId: string
  ): Promise<{ messages: IMessage[]; rescueRequest: any }> {
    if (!userId) {
      throw new UnauthorizedError('Chưa xác thực');
    }

    // Verify user has access to this rescue request
    const rescueRequest = await rescueRepository.findById(rescueRequestId);
    if (!rescueRequest) {
      throw new NotFoundError('Yêu cầu cứu hộ không tồn tại');
    }

    if (!hasRequestAccess(rescueRequest, userId, userRole)) {
      throw new ForbiddenError('Không có quyền truy cập cuộc trò chuyện này');
    }

    const messages = await messageRepository.findByRescueRequestId(rescueRequestId);

    return {
      messages,
      rescueRequest: {
        _id: rescueRequest._id,
        company_name: rescueRequest.company.company_name,
        customer_name: (rescueRequest.user_id as any)?.full_name || 'Khách hàng',
        status: rescueRequest.status,
      },
    };
  }

  async sendImage(
    userId: string,
    userRole: string,
    rescueRequestId: string,
    filename: string,
    protocol: string,
    host: string,
    io?: any
  ): Promise<IMessage> {
    if (!userId) {
      throw new UnauthorizedError('Chưa xác thực');
    }

    const rescueRequest = await rescueRepository.findById(rescueRequestId);
    if (!rescueRequest) {
      throw new NotFoundError('Yêu cầu cứu hộ không tồn tại');
    }

    if (!hasRequestAccess(rescueRequest, userId, userRole)) {
      throw new ForbiddenError('Không có quyền truy cập cuộc trò chuyện này');
    }

    if (
      rescueRequest.status === 'completed' ||
      rescueRequest.status === 'cancelled' ||
      rescueRequest.status === 'rejected'
    ) {
      throw new BadRequestError('Không thể gửi tin nhắn do yêu cầu cứu hộ đã kết thúc hoặc bị hủy');
    }

    const imageUrl = `${protocol}://${host}/uploads/${filename}`;
    const senderType = userRole === 'company' ? 'company' : 'user';

    const message = await messageRepository.create({
      rescue_request_id: rescueRequestId as any,
      sender_type: senderType,
      sender_id: userId as any,
      content: imageUrl,
      content_type: 'image',
      is_read: false,
    });

    // Emit event for notifications and/or sockets
    messageEventEmitter.emit(MESSAGE_EVENTS.MESSAGE_SENT, {
      message,
      rescueRequest,
      io,
    });

    return message;
  }
}

export const messageService = new MessageService();
