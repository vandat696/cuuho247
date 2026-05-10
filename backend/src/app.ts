import express, { Application } from 'express';
import cors from 'cors';
import vehicleRoutes from './routes/vehicle.routes';
import authRoutes from './routes/auth.route';
import { errorHandler } from './middleware/error.middleware';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

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

// Mount Routes
app.use('/api/vehicles', vehicleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use(errorHandler);

export default app;
