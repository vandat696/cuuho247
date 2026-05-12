import { Router } from 'express';
import authRoutes from './auth.route';
import companyRoutes from './company.route';
import vehicleRoutes from './vehicle.routes';
import rescueRoutes from './rescue.route';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Company routes
router.use('/company', companyRoutes);

// Vehicle Routes
router.use('/vehicles', vehicleRoutes);

// Rescue Routes
router.use('/rescue', rescueRoutes);

export default router;
