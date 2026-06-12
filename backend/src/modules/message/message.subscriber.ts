import { messageEventEmitter, MESSAGE_EVENTS } from './message.event';
import { notificationService } from '../notification/notification.service';
import rescueRepository from '../rescue/rescue.repository';
import { Message, Notification } from '@/shared/models';
import { Types } from 'mongoose';

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

    // Populate user_id to get full name of customer if sender is customer
    if (!isCompanySender) {
      await rescueRequest.populate('user_id', 'full_name');
    }
    const customerName = (rescueRequest.user_id as any)?.full_name || 'Khách hàng';
    const senderName = isCompanySender ? rescueRequest.company.company_name : customerName;

    // Count unread messages from this sender for this rescue request
    const unreadCount = await Message.countDocuments({
      rescue_request_id: rescueRequestId,
      sender_type: senderType,
      is_read: false,
    });

    // Delete any existing unread notification of type chat_message for this request and recipient
    await Notification.deleteMany({
      recipient_id: new Types.ObjectId(recipientId),
      recipient_type: recipientType,
      type: 'chat_message',
      is_read: false,
      $or: [
        { 'payload.rescue_request_id': rescueRequestId },
        { 'payload.rescue_request_id': new Types.ObjectId(rescueRequestId) },
      ],
    });

    await notificationService.createAndSendNotification(
      recipientId,
      recipientType,
      'chat_message',
      'Tin nhắn mới',
      `Bạn có ${unreadCount} tin nhắn mới từ ${senderName}`,
      { rescue_request_id: rescueRequestId, unread_count: unreadCount }
    );
  } catch (err) {
    console.error('[Socket] Error in message subscriber:', err);
  }
});
