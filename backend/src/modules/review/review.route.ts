import { Router } from 'express';
import { reviewController } from './review.controller';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { authorize } from '@/shared/middleware/authorize.middleware';
import { checkCompanyActive } from '@/shared/middleware/checkCompanyActive.middleware';
import './review.subscriber';

const router = Router();

// Customer route: create a review
router.post('/', authenticate, authorize(['customer']), reviewController.createReview);

// Public/Auth route: get reviews of a specific company
// Use optional auth if needed, but here we can just use normal routes. Let's make it public or authenticated.
// For now, it doesn't strictly need auth to view company reviews.
router.get('/company/:companyId', reviewController.getCompanyReviews);

// Auth route: get review by rescue request id (can be accessed by customer who owns it, or company assigned to it)
router.get('/request/:requestId', authenticate, reviewController.getReviewByRequest);

// Company route: reply to a customer review
router.patch('/:id/reply', authenticate, authorize(['company']), checkCompanyActive, reviewController.replyToReview);

export default router;
