/**
 * Message Module – Public Contracts (Interfaces)
 */
import type { IMessage } from '@/shared/models/Message.model';

// ─── Repository Contract ───────────────────────────────────────────────────────

export interface IMessageRepository {
  findByRescueRequestId(requestId: string): Promise<IMessage[]>;
  create(data: Partial<IMessage>): Promise<IMessage>;
}
