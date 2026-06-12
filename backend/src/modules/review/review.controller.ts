import { Response, NextFunction } from 'express';
import { reviewService } from './review.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { createReviewSchema, replyReviewSchema } from './review.validator';
import { validateSchema } from '../../shared/utils/validation.util';
import { AppError, BadRequestError, NotFoundError, ForbiddenError } from '../../shared/utils/apiError.util';

export class ReviewController {
  async createReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;

      const value = validateSchema<any>(createReviewSchema, req.body, { abortEarly: false });

      const review = await reviewService.createReview(userId, value);
      res.status(201).json({ status: 'success', data: review });
    } catch (error: any) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError(error.message));
      }
    }
  }

  async getReviewByRequest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role;
      const { requestId } = req.params;

      const review = await reviewService.getReviewByRequest(userId, userRole, requestId);

      if (!review) {
        throw new NotFoundError('Không tìm thấy đánh giá cho yêu cầu này');
      }

      res.json({ status: 'success', data: review });
    } catch (error: any) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new ForbiddenError(error.message));
      }
    }
  }

  async getCompanyReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { companyId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await reviewService.getCompanyReviews(companyId, page, limit);
      res.json({ status: 'success', data: result });
    } catch (error: any) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError(error.message));
      }
    }
  }

  async replyToReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const companyId = req.user.id;
      const { id } = req.params;

      const value = validateSchema<any>(replyReviewSchema, req.body, { abortEarly: false });

      const review = await reviewService.replyToReview(companyId, id, value);
      res.json({ status: 'success', data: review });
    } catch (error: any) {
      if (error instanceof AppError) {
        next(error);
      } else {
        next(new BadRequestError(error.message));
      }
    }
  }
}

export const reviewController = new ReviewController();
