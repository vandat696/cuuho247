import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
    Server running on: http://localhost:${PORT}
    Environment: ${NODE_ENV}
    API: http://localhost:${PORT}/api
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
