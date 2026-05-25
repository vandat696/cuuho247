import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { Message } from '../models/Message.model';

interface SocketUser {
  id: string;
  role: string;
  email: string;
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser;
}

export function setupSocket(io: Server): void {
  // JWT Authentication middleware for socket connections
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: Token missing'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as SocketUser;
      socket.user = decoded;
      next();
    } catch {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`[Socket] User connected: ${socket.user?.id} (${socket.user?.role})`);

    /**
     * join_chat: Client joins a room for a specific rescue request
     * Payload: { rescue_request_id: string }
     */
    socket.on('join_chat', ({ rescue_request_id }: { rescue_request_id: string }) => {
      if (!rescue_request_id) {
        socket.emit('error', { message: 'rescue_request_id is required' });
        return;
      }

      const room = `chat:${rescue_request_id}`;
      socket.join(room);
      console.log(`[Socket] ${socket.user?.id} joined room: ${room}`);
      socket.emit('joined_chat', { rescue_request_id, room });
    });

    /**
     * send_message: Client sends a message
     * Payload: { rescue_request_id: string, content: string }
     */
    socket.on(
      'send_message',
      async ({ rescue_request_id, content }: { rescue_request_id: string; content: string }) => {
        if (!socket.user) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        if (!rescue_request_id || !content?.trim()) {
          socket.emit('error', { message: 'rescue_request_id and content are required' });
          return;
        }

        try {
          const senderType = socket.user.role === 'company' ? 'company' : 'user';

          const message = await Message.create({
            rescue_request_id,
            sender_type: senderType,
            sender_id: socket.user.id,
            content: content.trim(),
            content_type: 'text',
            is_read: false,
          });

          const messageData = {
            _id: message._id,
            rescue_request_id,
            sender_type: senderType,
            sender_id: socket.user.id,
            content: message.content,
            content_type: message.content_type,
            is_read: message.is_read,
            created_at: message.created_at,
          };

          const room = `chat:${rescue_request_id}`;
          // Broadcast to all members in the room (including sender)
          io.to(room).emit('receive_message', messageData);

          console.log(`[Socket] Message saved & sent to room ${room}`);
        } catch (err) {
          console.error('[Socket] Error saving message:', err);
          socket.emit('error', { message: 'Failed to send message' });
        }
      }
    );

    /**
     * mark_read: Mark messages as read
     * Payload: { rescue_request_id: string }
     */
    socket.on('mark_read', async ({ rescue_request_id }: { rescue_request_id: string }) => {
      if (!socket.user || !rescue_request_id) return;

      try {
        const senderType = socket.user.role === 'company' ? 'user' : 'company';
        await Message.updateMany(
          { rescue_request_id, sender_type: senderType, is_read: false },
          { $set: { is_read: true } }
        );

        const room = `chat:${rescue_request_id}`;
        io.to(room).emit('messages_read', { rescue_request_id, reader_id: socket.user.id });
      } catch (err) {
        console.error('[Socket] Error marking messages as read:', err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.user?.id}`);
    });
  });
}
