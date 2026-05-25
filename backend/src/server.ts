import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import app from './app';
import { connectDB } from './config/db';
import { setupSocket } from './socket';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const start = async () => {
  await connectDB();

  // Wrap Express app in Node HTTP server so Socket.IO can attach
  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  setupSocket(io);

  httpServer.listen(PORT, () => {
    console.log(`
    Server running on: http://localhost:${PORT}
    Environment: ${NODE_ENV}
    API: http://localhost:${PORT}/api
    Socket.IO: ws://localhost:${PORT}
    Health check: http://localhost:${PORT}/api/health

Ready for requests!
  `);
  });
};

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
