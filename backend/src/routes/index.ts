import { Router } from 'express';
import authRoutes from './auth.route';
import companyRoutes from './company.route';
import vehicleRoutes from './vehicle.routes';
import rescueRoutes from './rescue.route';
import rescueRequestRoutes from './rescueRequest.route';
import serviceRoutes from './service.route';
import serviceCategoryRoutes from './serviceCategory.route';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Company services routes
router.use('/company/services', serviceRoutes);

// Company routes
router.use('/company', companyRoutes);

// Service category routes
router.use('/service-categories', serviceCategoryRoutes);

// Vehicle Routes
router.use('/vehicles', vehicleRoutes);

// Rescue Routes
router.use('/rescue', rescueRoutes);
router.use('/rescue-requests', rescueRequestRoutes);
router.use('/rescue/requests', rescueRequestRoutes);

export default router;
