/**
 * Message Module – Public Contracts (Interfaces)
 */
import type { IMessage } from '@/shared/models/Message.model';

// ─── Repository Contract ───────────────────────────────────────────────────────

export interface IMessageRepository {
  findByRescueRequestId(requestId: string): Promise<IMessage[]>;
  create(data: Partial<IMessage>): Promise<IMessage>;
  markAsRead(requestId: string, senderType: string): Promise<any>;
}

// ─── Service Contract ──────────────────────────────────────────────────────────

export interface IMessageService {
  getMessages(
    userId: string,
    userRole: string,
    rescueRequestId: string
  ): Promise<{ messages: IMessage[]; rescueRequest: any }>;
  sendImage(
    userId: string,
    userRole: string,
    rescueRequestId: string,
    filename: string,
    protocol: string,
    host: string,
    io?: any
  ): Promise<IMessage>;
}
