import { communityRepository } from './community.repository';
import companyRepository from '../company/company.repository';
import { communityEventEmitter, COMMUNITY_EVENTS } from './community.event';
import { NotFoundError, ForbiddenError, UnauthorizedError } from '@/shared/utils/apiError.util';

class CommunityService {
  private async assertCompanyActive(userId: string, role: string): Promise<void> {
    if (role !== 'company') return;
    const company = await companyRepository.findById(userId);
    if (!company || company.status !== 'active') {
      throw new ForbiddenError('Chỉ công ty đã được xác thực mới có thể tham gia cộng đồng');
    }
  }

  private roleToUserType(role: string): 'User' | 'Company' {
    return role === 'company' ? 'Company' : 'User';
  }

  private async patchMissingUserTypes(): Promise<void> {
    const unpatchedPosts = await communityRepository.findUnpatchedPosts();
    for (const post of unpatchedPosts) {
      const isCompany = await communityRepository.checkCompanyExists(post.user_id.toString());
      post.user_type = isCompany ? 'Company' : 'User';
      await post.save();
    }

    const unpatchedComments = await communityRepository.findUnpatchedComments();
    for (const comment of unpatchedComments) {
      const isCompany = await communityRepository.checkCompanyExists(comment.user_id.toString());
      comment.user_type = isCompany ? 'Company' : 'User';
      await comment.save();
    }
  }

  async getPosts(
    userId: string | undefined,
    query: { page?: number; limit?: number; tagId?: string; search?: string }
  ): Promise<{ posts: any[]; total: number; page: number; limit: number; totalPages: number }> {
    const page = Number(query.page || 1);
    const limit = Number(query.limit || 10);
    const filter: any = { is_visible: true };

    if (query.tagId) {
      filter.tags = query.tagId;
    }

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { content: { $regex: query.search, $options: 'i' } },
      ];
    }

    // Patch old post user_types dynamically
    await this.patchMissingUserTypes();

    const skip = (page - 1) * limit;
    const posts = await communityRepository.findPosts(filter, skip, limit);
    const total = await communityRepository.countPosts(filter);

    const likedPostIds = new Set<string>();
    if (userId) {
      const postIds = posts.map((p) => p._id.toString());
      const likes = await communityRepository.findLikesForPosts(userId, postIds);
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

    return {
      posts: postsWithLikes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getPostDetails(
    postId: string,
    userId: string | undefined
  ): Promise<{ post: any; comments: any[]; isLiked: boolean }> {
    await this.patchMissingUserTypes();

    const post = await communityRepository.findPostById(postId);
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const comments = await communityRepository.findCommentsByPostId(postId);

    let isLiked = false;
    if (userId) {
      const like = await communityRepository.findLike(postId, userId);
      if (like) isLiked = true;
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

    return {
      post: postObj,
      comments: commentsWithAuthor,
      isLiked,
    };
  }

  async createPost(
    userId: string,
    role: string,
    postData: { title: string; content: string; tags?: string | string[] },
    filenames: string[]
  ): Promise<any> {
    await this.assertCompanyActive(userId, role);

    let processedTags: string[] = [];
    if (postData.tags) {
      if (Array.isArray(postData.tags)) {
        processedTags = postData.tags;
      } else {
        processedTags = [postData.tags];
      }
    }

    const newPost = await communityRepository.createPost({
      user_id: userId,
      user_type: this.roleToUserType(role),
      title: postData.title,
      content: postData.content,
      images: filenames,
      tags: processedTags,
      like_count: 0,
      comment_count: 0,
    });

    return newPost;
  }

  async toggleLike(userId: string, role: string, postId: string): Promise<{ message: string }> {
    await this.assertCompanyActive(userId, role);

    const post = await communityRepository.findPostById(postId);
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const existingLike = await communityRepository.findLike(postId, userId);

    if (existingLike) {
      await communityRepository.deleteLike(existingLike._id.toString());
      await communityRepository.incrementLikeCount(postId, -1);
      return { message: 'Post unliked' };
    } else {
      await communityRepository.createLike(postId, userId);
      await communityRepository.incrementLikeCount(postId, 1);
      return { message: 'Post liked' };
    }
  }

  async addComment(userId: string, role: string, postId: string, content: string): Promise<any> {
    await this.assertCompanyActive(userId, role);

    const post = await communityRepository.findPostById(postId);
    if (!post) {
      throw new NotFoundError('Post not found');
    }

    const comment = await communityRepository.createComment({
      post_id: postId,
      user_id: userId,
      user_type: this.roleToUserType(role),
      content,
    });

    await communityRepository.incrementCommentCount(postId, 1);

    const populatedComment = await communityRepository.findCommentById(comment._id.toString());
    const populatedCommentObj = populatedComment ? populatedComment.toObject() : comment;

    // Trigger side-effects via events
    communityEventEmitter.emit(COMMUNITY_EVENTS.COMMENT_ADDED, {
      post,
      comment: populatedCommentObj,
      userId,
      role,
      content,
    });

    return populatedComment;
  }
}

export const communityService = new CommunityService();
