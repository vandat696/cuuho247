import express, { Application } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';

const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  });
});

// Test route
app.get('/api/test', (_req, res) => {
  res.json({
    message: 'Test endpoint working',
    data: {
      frontend: 'http://localhost:5173',
      backend: 'http://localhost:3000',
      database: 'MongoDB Atlas (configured in .env)',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});

export default app;
