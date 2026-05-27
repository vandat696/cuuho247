import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

/**
 * Get or create the Socket.IO singleton instance.
 * Pass the auth token so the server can authenticate the connection.
 */
export function getSocket(): Socket {
  if (!socket || !socket.connected) {
    const token = localStorage.getItem('accessToken');

    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket?.id);
    });

    socket.on('connect_error', (err) => {
      console.error('[Socket] Connection error:', err.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason);
    });
  }

  return socket;
}

/**
 * Disconnect and clean up the socket singleton.
 * Call this when the user logs out or when the chat page unmounts (optional).
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
