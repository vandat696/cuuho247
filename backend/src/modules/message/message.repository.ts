import { Message, IMessage } from '@/shared/models/Message.model';

class MessageRepository {
  async findByRescueRequestId(requestId: string): Promise<IMessage[]> {
    return Message.find({ rescue_request_id: requestId }).sort({ created_at: 1 }).lean().exec() as any;
  }

  async create(data: Partial<IMessage>): Promise<IMessage> {
    const message = new Message(data);
    return message.save();
  }

  async markAsRead(requestId: string, senderType: string): Promise<any> {
    return Message.updateMany(
      { rescue_request_id: requestId, sender_type: senderType, is_read: false },
      { $set: { is_read: true } }
    ).exec();
  }
}

export const messageRepository = new MessageRepository();
