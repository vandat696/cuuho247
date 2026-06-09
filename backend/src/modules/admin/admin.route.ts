import { Router } from 'express';
import adminController from './admin.controller';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { authorize } from '@/shared/middleware/authorize.middleware';

const router = Router();

router.use(authenticate);
router.use(authorize(['admin']));

// Company verification routes
router.get('/companies/pending', adminController.getPendingCompanies);
router.patch('/companies/:companyId/approve', adminController.approveCompany);
router.patch('/companies/:companyId/reject', adminController.rejectCompany);
router.patch('/companies/:companyId/request-docs', adminController.requestDocuments);

// Review management
router.get('/reviews', adminController.getReviews);
router.put('/reviews/:reviewId/remove', adminController.removeReview);
router.put('/reviews/:reviewId/reply/remove', adminController.removeReviewReply);
router.put('/reviews/:reviewId/restore', adminController.restoreReview);
router.put('/reviews/:reviewId/reply/restore', adminController.restoreReviewReply);

// Audit logs
router.get('/logs', adminController.getAuditLogs);

export default router;
