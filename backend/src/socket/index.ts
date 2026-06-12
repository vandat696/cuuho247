import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import rescueRepository from '../modules/rescue/rescue.repository';
import { messageRepository } from '../modules/message/message.repository';
import { messageEventEmitter, MESSAGE_EVENTS } from '../modules/message/message.event';
import { hasRequestAccess } from '../shared/utils/rescueRequestAuth';

interface SocketUser {
  id: string;
  role: string;
  email: string;
}

interface AuthenticatedSocket extends Socket {
  user?: SocketUser;
}

async function validateRequestAccess(
  socket: AuthenticatedSocket,
  rescue_request_id: string,
  accessDeniedMessage: string = 'Không có quyền truy cập yêu cầu này',
  silent: boolean = false
): Promise<any | null> {
  if (!rescue_request_id) {
    if (!silent) socket.emit('error', { message: 'rescue_request_id is required' });
    return null;
  }

  if (!socket.user) {
    if (!silent) socket.emit('error', { message: 'Unauthorized' });
    return null;
  }

  try {
    const rescueRequest = await rescueRepository.findById(rescue_request_id);
    if (!rescueRequest) {
      if (!silent) socket.emit('error', { message: 'Yêu cầu cứu hộ không tồn tại' });
      return null;
    }

    if (!hasRequestAccess(rescueRequest, socket.user.id, socket.user.role)) {
      if (!silent) socket.emit('error', { message: accessDeniedMessage });
      return null;
    }

    return rescueRequest;
  } catch (err) {
    console.error('[Socket] Error validating request access:', err);
    if (!silent) socket.emit('error', { message: 'Internal server error' });
    return null;
  }
}

let ioInstance: Server | null = null;

export function getIo(): Server | null {
  return ioInstance;
}

export function setupSocket(io: Server): void {
  ioInstance = io;

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

    if (socket.user) {
      const userRoom = `user:${socket.user.id}`;
      socket.join(userRoom);
      console.log(`[Socket] User ${socket.user.id} joined personal room: ${userRoom}`);

      if (socket.user.role === 'company') {
        socket.join(`company:${socket.user.id}`);
        console.log(`[Socket] Company ${socket.user.id} joined room: company:${socket.user.id}`);
      }
    }

    /**
     * join_chat: Client joins a room for a specific rescue request
     * Payload: { rescue_request_id: string }
     */
    socket.on('join_chat', async ({ rescue_request_id }: { rescue_request_id: string }) => {
      const rescueRequest = await validateRequestAccess(
        socket,
        rescue_request_id,
        'Không có quyền truy cập cuộc trò chuyện này'
      );
      if (!rescueRequest) return;

      try {
        const room = `chat:${rescue_request_id}`;
        socket.join(room);
        console.log(`[Socket] ${socket.user?.id} joined room: ${room}`);
        socket.emit('joined_chat', { rescue_request_id, room });
      } catch (err) {
        console.error('[Socket] Error joining chat:', err);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    /**
     * send_message: Client sends a message
     * Payload: { rescue_request_id: string, content: string }
     */
    socket.on(
      'send_message',
      async ({ rescue_request_id, content }: { rescue_request_id: string; content: string }) => {
        if (!content?.trim()) {
          socket.emit('error', { message: 'rescue_request_id and content are required' });
          return;
        }

        const rescueRequest = await validateRequestAccess(
          socket,
          rescue_request_id,
          'Không có quyền truy cập cuộc trò chuyện này'
        );
        if (!rescueRequest) return;

        try {
          if (
            rescueRequest.status === 'completed' ||
            rescueRequest.status === 'cancelled' ||
            rescueRequest.status === 'rejected'
          ) {
            socket.emit('error', { message: 'Không thể gửi tin nhắn do yêu cầu cứu hộ đã kết thúc hoặc bị hủy' });
            return;
          }

          const senderType = socket.user.role === 'company' ? 'company' : 'user';

          const message = await messageRepository.create({
            rescue_request_id: rescue_request_id as any,
            sender_type: senderType,
            sender_id: socket.user.id as any,
            content: content.trim(),
            content_type: 'text',
            is_read: false,
          });

          // Emit event for subscriber to handle broadcast and notification
          messageEventEmitter.emit(MESSAGE_EVENTS.MESSAGE_SENT, {
            message,
            io,
          });
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
      const rescueRequest = await validateRequestAccess(socket, rescue_request_id, '', true);
      if (!rescueRequest) return;

      try {
        const senderType = socket.user!.role === 'company' ? 'user' : 'company';
        await messageRepository.markAsRead(rescue_request_id, senderType);

        const room = `chat:${rescue_request_id}`;
        io.to(room).emit('messages_read', { rescue_request_id, reader_id: socket.user!.id });
      } catch (err) {
        console.error('[Socket] Error marking messages as read:', err);
      }
    });

    /**
     * join_tracking: Client joins a tracking room for a specific rescue request
     */
    socket.on('join_tracking', async ({ rescue_request_id }: { rescue_request_id: string }) => {
      const rescueRequest = await validateRequestAccess(
        socket,
        rescue_request_id,
        'Không có quyền truy cập yêu cầu này'
      );
      if (!rescueRequest) return;

      try {
        const room = `tracking:${rescue_request_id}`;
        socket.join(room);
        console.log(`[Socket] ${socket.user?.id} joined tracking room: ${room}`);
      } catch (err) {
        console.error('[Socket] Error joining tracking:', err);
        socket.emit('error', { message: 'Failed to join tracking' });
      }
    });

    /**
     * update_location: Company sends real-time location to the tracking room
     */
    socket.on(
      'update_location',
      async (payload: { rescue_request_id: string; lat: number; lng: number; heading?: number }) => {
        if (!socket.user || socket.user.role !== 'company') {
          return; // Only company can send location updates
        }
        const { rescue_request_id, lat, lng, heading } = payload;
        if (!rescue_request_id || typeof lat !== 'number' || typeof lng !== 'number') {
          return;
        }
        // Broadcast to tracking room
        const room = `tracking:${rescue_request_id}`;
        io.to(room).emit('location_updated', {
          rescue_request_id,
          location: { lat, lng, heading },
          timestamp: new Date(),
        });
      }
    );

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.user?.id}`);
    });
  });
}
