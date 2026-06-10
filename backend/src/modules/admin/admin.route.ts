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

// User management
router.get('/users', adminController.getUsers);
router.get('/users/:userId', adminController.getUserById);
router.patch('/users/:userId/lock', adminController.lockUser);
router.patch('/users/:userId/unlock', adminController.unlockUser);
router.get('/users/:userId/logs', adminController.getUserLogs);

// Company lock/unlock management
router.get('/companies/all', adminController.getAllCompanies);
router.get('/companies', adminController.getCompanies);
router.get('/companies/:companyId', adminController.getCompanyById);
router.patch('/companies/:companyId/lock', adminController.lockCompany);
router.patch('/companies/:companyId/unlock', adminController.unlockCompany);
router.get('/companies/:companyId/logs', adminController.getCompanyLogs);

// Community moderation
router.get('/community/posts', adminController.getCommunityPosts);
router.get('/community/posts/:postId/comments', adminController.getPostComments);
router.put('/community/posts/:postId/remove', adminController.removePost);
router.put('/community/posts/:postId/restore', adminController.restorePost);
router.put('/community/comments/:commentId/remove', adminController.removeComment);
router.put('/community/comments/:commentId/restore', adminController.restoreComment);

// Reports
router.get('/reports/rescue-activities', adminController.getRescueActivitiesReport);
router.get('/reports/service-quality', adminController.getServiceQualityReport);

export default router;
