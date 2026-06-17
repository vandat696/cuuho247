import 'express-async-errors';
import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import { errorHandler } from './shared/middleware/error.middleware';

import { NotFoundError } from './shared/utils/apiError.util';

const app: Application = express();

// Trust proxy (Fly.io, Render, Vercel) to resolve req.protocol as 'https'
app.set('trust proxy', true);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api', routes);

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
  throw new NotFoundError(`Route ${req.path} not found`);
});

// Error handler
app.use(errorHandler);

export default app;
