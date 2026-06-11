import { Response } from 'express';
import { reviewService } from './review.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { createReviewSchema, replyReviewSchema } from './review.validator';
import { validateSchema } from '../../shared/utils/validation.util';

export class ReviewController {
  async createReview(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;

      const value = validateSchema<any>(createReviewSchema, req.body, res, { abortEarly: false });
      if (!value) return;

      const review = await reviewService.createReview(userId, value);
      res.status(201).json({ status: 'success', data: review });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getReviewByRequest(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { requestId } = req.params;

      const review = await reviewService.getReviewByRequest(userId, userRole, requestId);

      if (!review) {
        res.status(404).json({ status: 'error', message: 'Không tìm thấy đánh giá cho yêu cầu này' });
        return;
      }

      res.json({ status: 'success', data: review });
    } catch (error: any) {
      res.status(403).json({ status: 'error', message: error.message });
    }
  }

  async getCompanyReviews(req: AuthRequest, res: Response) {
    try {
      const { companyId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await reviewService.getCompanyReviews(companyId, page, limit);
      res.json({ status: 'success', data: result });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async replyToReview(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user.id;
      const { id } = req.params;

      const value = validateSchema<any>(replyReviewSchema, req.body, res, { abortEarly: false });
      if (!value) return;

      const review = await reviewService.replyToReview(companyId, id, value);
      res.json({ status: 'success', data: review });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export const reviewController = new ReviewController();
