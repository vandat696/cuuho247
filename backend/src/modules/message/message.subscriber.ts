import { messageEventEmitter, MESSAGE_EVENTS } from './message.event';
import { notificationService } from '../notification/notification.service';
import rescueRepository from '../rescue/rescue.repository';

messageEventEmitter.on(MESSAGE_EVENTS.MESSAGE_SENT, async ({ message, io }) => {
  try {
    const rescueRequestId = message.rescue_request_id.toString();
    const rescueRequest = await rescueRepository.findById(rescueRequestId);
    if (!rescueRequest) return;

    // 1. Broadcast message to socket room
    if (io) {
      const room = `chat:${rescueRequestId}`;
      const messageData = {
        _id: message._id,
        rescue_request_id: rescueRequestId,
        sender_type: message.sender_type,
        sender_id: message.sender_id,
        content: message.content,
        content_type: message.content_type,
        is_read: message.is_read,
        created_at: message.created_at,
      };
      io.to(room).emit('receive_message', messageData);
      console.log(`[Socket] Message broadcasted to room ${room}`);
    }

    // 2. Send Notification
    const senderType = message.sender_type;
    const isCompanySender = senderType === 'company';
    const recipientId = isCompanySender
      ? rescueRequest.user_id.toString()
      : rescueRequest.company.company_id.toString();
    const recipientType = isCompanySender ? 'user' : 'company';
    const senderName = isCompanySender ? rescueRequest.company.company_name : 'Khách hàng';
    const isImage = message.content_type === 'image';

    await notificationService.createAndSendNotification(
      recipientId,
      recipientType,
      'chat_message',
      'Tin nhắn mới',
      isImage ? `Bạn có tin nhắn ảnh mới từ ${senderName}` : `Bạn có tin nhắn mới từ ${senderName}`,
      { rescue_request_id: rescueRequestId }
    );
  } catch (err) {
    console.error('[Socket] Error in message subscriber:', err);
  }
});
