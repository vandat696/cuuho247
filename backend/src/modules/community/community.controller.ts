import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { communityService } from './community.service';
import { UnauthorizedError } from '@/shared/utils/apiError.util';

export const getPosts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page, limit, tagId, search } = req.query as any;
    const userId = req.user?.id;

    const result = await communityService.getPosts(userId, { page, limit, tagId, search });

    res.json({
      data: result.posts,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getPostDetails = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const result = await communityService.getPostDetails(id, userId);

    res.json({
      data: {
        ...result.post,
        comments: result.comments,
        is_liked: result.isLiked,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const createPost = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, content, tags } = req.body;
    const user_id = req.user?.id;
    const role = req.user?.role as string;

    if (!user_id) throw new UnauthorizedError('Unauthorized');

    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any) => {
        imageUrls.push(file.path);
      });
    }

    const newPost = await communityService.createPost(user_id, role, { title, content, tags }, imageUrls);

    res.status(201).json({
      message: 'Post created successfully',
      data: newPost,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    const role = req.user?.role as string;

    if (!user_id) throw new UnauthorizedError('Unauthorized');

    const result = await communityService.toggleLike(user_id, role, id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const addComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user?.id;
    const role = req.user?.role as string;

    if (!user_id) throw new UnauthorizedError('Unauthorized');

    const comment = await communityService.addComment(user_id, role, id, content);

    res.status(201).json({
      message: 'Comment added',
      data: comment,
    });
  } catch (err) {
    next(err);
  }
};
