/**
 * Routes: Nơi lắp ráp tất cả Module Routes vào một Router duy nhất.
 *
 * Đây là điểm giao tiếp duy nhất giữa các modules và app entry point.
 * Mỗi module tự quản lý routes nội bộ của mình; file này chỉ mount chúng.
 */
import { Router } from 'express';

// ─── Module Routes ─────────────────────────────────────────────────────────────
import authRoutes from './modules/auth/auth.route';
import companyRoutes from './modules/company/company.route';
import vehicleRoutes from './modules/vehicle/vehicle.route';
import rescueRoutes from './modules/rescue/rescue.route';
import { serviceRouter, serviceCategoryRouter } from './modules/service-catalog/service-catalog.route';
import messageRoutes from './modules/message/message.route';
import adminRoutes from './modules/admin/admin.route';

const router = Router();

// Auth routes
router.use('/auth', authRoutes);

// Company services routes (phải đặt trước /company để avoid route conflict)
router.use('/company/services', serviceRouter);

// Company routes
router.use('/company', companyRoutes);

// Service category routes
router.use('/service-categories', serviceCategoryRouter);

// Vehicle Routes
router.use('/vehicles', vehicleRoutes);

// Rescue Routes (gộp cả company side và customer side)
router.use('/rescue', rescueRoutes);

// Message Routes
router.use('/messages', messageRoutes);

// Admin Routes
router.use('/admin', adminRoutes);

export default router;
