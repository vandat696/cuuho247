import { Request, Response } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { CommunityPost, CommunityPostComment, CommunityPostLike, User, Company } from '@/shared/models';
import { ApiError } from '@/shared/utils/apiError.util';
import { notificationService } from '../notification/notification.service';

/**
 * Kiểm tra nếu user là company thì phải có status 'active' mới được tương tác.
 * Customer không bị ảnh hưởng.
 */
const assertCompanyActive = async (userId: string, role: string): Promise<void> => {
  if (role !== 'company') return;
  const company = await Company.findById(userId).select('status').exec();
  if (!company || company.status !== 'active') {
    throw new ApiError(403, 'Chỉ công ty đã được xác thực mới có thể tham gia cộng đồng');
  }
};

/** Map role string → Mongoose model name dùng cho refPath */
const roleToUserType = (role: string): 'User' | 'Company' => {
  return role === 'company' ? 'Company' : 'User';
};

/** Patch các bài viết/comment cũ chưa có user_type bằng cách kiểm tra sự tồn tại trong Company collection */
const patchMissingUserTypes = async () => {
  const unpatchedPosts = await CommunityPost.find({ user_type: { $exists: false } });
  for (const post of unpatchedPosts) {
    const isCompany = await Company.exists({ _id: post.user_id });
    post.user_type = isCompany ? 'Company' : 'User';
    await post.save();
  }

  const unpatchedComments = await CommunityPostComment.find({ user_type: { $exists: false } });
  for (const comment of unpatchedComments) {
    const isCompany = await Company.exists({ _id: comment.user_id });
    comment.user_type = isCompany ? 'Company' : 'User';
    await comment.save();
  }
};

export const getPosts = async (req: AuthRequest, res: Response) => {
  const { page = 1, limit = 10, tagId, search } = req.query as any;
  const filter: any = { is_visible: true };

  if (tagId) {
    filter.tags = tagId;
  }

  if (search) {
    filter.$or = [{ title: { $regex: search, $options: 'i' } }, { content: { $regex: search, $options: 'i' } }];
  }

  // Patch các bài viết cũ chưa có user_type (kiểm tra động)
  await patchMissingUserTypes();

  const posts = await CommunityPost.find(filter)
    .sort({ created_at: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('user_id', 'full_name company_name avatar_url role')
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

  const postsWithLikes = posts.map((post) => {
    const obj = post.toObject() as any;
    const author = obj.user_id as any;
    obj.author_name = author?.company_name || author?.full_name || null;
    obj.author_avatar = author?.avatar_url || null;
    obj.is_liked = likedPostIds.has(post._id.toString());
    return obj;
  });

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

  // Patch nếu bài viết cũ chưa có user_type (kiểm tra động)
  await patchMissingUserTypes();

  const post = await CommunityPost.findOne({ _id: id, is_visible: true })
    .populate('user_id', 'full_name company_name avatar_url role')
    .populate('tags', 'name');

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comments = await CommunityPostComment.find({ post_id: id, is_visible: true })
    .sort({ created_at: -1 })
    .populate('user_id', 'full_name company_name avatar_url role');

  let is_liked = false;
  if (req.user?.id) {
    const like = await CommunityPostLike.findOne({ post_id: id, user_id: req.user.id });
    if (like) is_liked = true;
  }

  const postObj = post.toObject() as any;
  const postAuthor = postObj.user_id as any;
  postObj.author_name = postAuthor?.company_name || postAuthor?.full_name || null;
  postObj.author_avatar = postAuthor?.avatar_url || null;

  const commentsWithAuthor = (comments as any[]).map((c) => {
    const obj = c.toObject ? c.toObject() : c;
    const ca = obj.user_id as any;
    obj.author_name = ca?.company_name || ca?.full_name || null;
    obj.author_avatar = ca?.avatar_url || null;
    return obj;
  });

  res.json({
    data: {
      ...postObj,
      comments: commentsWithAuthor,
      is_liked,
    },
  });
};

export const createPost = async (req: AuthRequest, res: Response) => {
  const { title, content, tags } = req.body;
  const user_id = req.user?.id;
  const role = req.user?.role as string;

  if (!user_id) throw new ApiError(401, 'Unauthorized');
  await assertCompanyActive(user_id, role);

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
    user_type: roleToUserType(role),
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
  const role = req.user?.role as string;

  if (!user_id) throw new ApiError(401, 'Unauthorized');
  await assertCompanyActive(user_id, role);

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
  const role = req.user?.role as string;

  if (!user_id) throw new ApiError(401, 'Unauthorized');
  await assertCompanyActive(user_id, role);

  const post = await CommunityPost.findOne({ _id: id, is_visible: true });
  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  const comment = await CommunityPostComment.create({
    post_id: id,
    user_id,
    user_type: roleToUserType(role),
    content,
  });

  await CommunityPost.updateOne({ _id: id }, { $inc: { comment_count: 1 } });

  const populatedComment = await CommunityPostComment.findById(comment._id).populate(
    'user_id',
    'full_name company_name avatar_url role'
  );

  // Notify the post author
  try {
    if (post.user_id && post.user_id.toString() !== user_id) {
      const commenterName = populatedComment?.user_id
        ? (populatedComment.user_id as any).company_name ||
          (populatedComment.user_id as any).full_name ||
          'Thành viên cộng đồng'
        : 'Thành viên cộng đồng';

      const recipientType = post.user_type === 'Company' ? 'company' : 'user';

      await notificationService.createAndSendNotification(
        post.user_id.toString(),
        recipientType,
        'new_comment',
        'Bình luận mới',
        `${commenterName} đã bình luận về bài viết của bạn: "${content.slice(0, 30)}${content.length > 30 ? '...' : ''}"`,
        { post_id: id }
      );
    }
  } catch (err) {
    console.error('Error creating new_comment notification:', err);
  }

  res.status(201).json({
    message: 'Comment added',
    data: populatedComment,
  });
};
