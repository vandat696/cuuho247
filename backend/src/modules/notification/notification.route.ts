import { Router } from 'express';
import { authenticate } from '../../shared/middleware/auth.middleware';
import notificationController from './notification.controller';

const router = Router();

// Apply auth middleware for all notification routes
router.use(authenticate);

// GET /api/notifications - Fetch user's notifications
router.get('/', notificationController.getMyNotifications);

// PATCH /api/notifications/:id/read - Mark notification as read
router.patch('/:id/read', notificationController.markAsRead);

// POST /api/notifications/read-all - Mark all notifications as read
router.post('/read-all', notificationController.markAllAsRead);

export default router;
