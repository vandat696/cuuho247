import { Request, Response } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { CommunityPost, CommunityPostComment, CommunityPostLike, User } from '@/shared/models';
import { ApiError } from '@/shared/utils/apiError.util';

export const getPosts = async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, tagId, search } = req.query as any;
  const filter: any = { is_visible: true };

  if (tagId) {
    filter.tags = tagId;
  }

  if (search) {
    filter.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
  }

  const posts = await CommunityPost.find(filter)
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user_id', 'full_name avatar_url role')
    .populate('tags', 'name');

  const total = await CommunityPost.countDocuments(filter);

  const likedPostIds = new Set<string>();
  if (req.user?.id) {
    const postIds = posts.map((p) => p._id);
    const likes = await CommunityPostLike.find({
      user_id: req.user.id,
      post_id: { $in: postIds },
    });
    likes.forEach((like) => likedPostIds.add(like.post_id.toString()));
  }

  const postsWithLikes = posts.map((post) => ({
    ...post.toObject(),
    is_liked: likedPostIds.has(post._id.toString()),
  }));

  res.json({
    data: postsWithLikes,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
};

export const getPostDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const post = await CommunityPost.findOne({ _id: id, is_visible: true })
    .populate('user_id', 'full_name avatar_url role')
    .populate('tags', 'name');

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comments = await CommunityPostComment.find({ post_id: id, is_visible: true })
    .sort({ created_at: -1 })
    .populate('user_id', 'full_name avatar_url role');

  let is_liked = false;
  if (req.user?.id) {
    const like = await CommunityPostLike.findOne({ post_id: id, user_id: req.user.id });
    if (like) is_liked = true;
  }

  res.json({
    data: {
      ...post.toObject(),
      comments,
      is_liked,
    },
  });
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, content, tags } = req.body;
  const user_id = req.user?.id;

  if (!user_id) throw new ApiError(401, 'Unauthorized');

  const images: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    req.files.forEach((file: any) => {
      images.push(file.filename);
    });
  }

  let processedTags: string[] = [];
  if (tags) {
    if (Array.isArray(tags)) {
      processedTags = tags;
    } else {
      processedTags = [tags];
    }
  }

  const newPost = await CommunityPost.create({
    user_id,
    title,
    content,
    images,
    tags: processedTags,
    like_count: 0,
    comment_count: 0,
  });

  res.status(201).json({
    message: 'Post created successfully',
    data: newPost,
  });
};

export const toggleLike = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user_id = req.user?.id;

  if (!user_id) throw new ApiError(401, 'Unauthorized');

  const post = await CommunityPost.findOne({ _id: id, is_visible: true });
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const existingLike = await CommunityPostLike.findOne({ post_id: id, user_id });

  if (existingLike) {
    await CommunityPostLike.deleteOne({ _id: existingLike._id });
    await CommunityPost.updateOne({ _id: id }, { $inc: { like_count: -1 } });
    res.json({ message: 'Post unliked' });
  } else {
    await CommunityPostLike.create({ post_id: id, user_id });
    await CommunityPost.updateOne({ _id: id }, { $inc: { like_count: 1 } });
    res.json({ message: 'Post liked' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const user_id = req.user?.id;

  if (!user_id) throw new ApiError(401, 'Unauthorized');

  const post = await CommunityPost.findOne({ _id: id, is_visible: true });
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = await CommunityPostComment.create({
    post_id: id,
    user_id,
    content,
  });

  await CommunityPost.updateOne({ _id: id }, { $inc: { comment_count: 1 } });

  const populatedComment = await CommunityPostComment.findById(comment._id).populate(
    'user_id',
    'full_name avatar_url role'
  );

  res.status(201).json({
    message: 'Comment added',
    data: populatedComment,
  });
};
