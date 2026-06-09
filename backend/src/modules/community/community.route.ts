import { Router } from 'express';
import { authenticate } from '@/shared/middleware/auth.middleware';
import { upload } from '@/shared/utils/upload.util';
import * as communityController from './community.controller';

const router = Router();

const optionalAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  authenticate(req, res, (err?: any) => {
    next();
  });
};

router.get('/', optionalAuth, communityController.getPosts);

router.get('/:id', optionalAuth, communityController.getPostDetails);

router.post('/', authenticate, upload.array('images', 5), communityController.createPost);

router.post('/:id/like', authenticate, communityController.toggleLike);

router.post('/:id/comments', authenticate, communityController.addComment);

export default router;
