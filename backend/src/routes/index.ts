import { Router } from 'express';
import authRoutes from './auth.route';
import companyRoutes from './company.route';
import vehicleRoutes from './vehicle.routes';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Company routes
router.use('/company', companyRoutes);

// Vehicle Routes
router.use('/vehicles', vehicleRoutes);

export default router;
