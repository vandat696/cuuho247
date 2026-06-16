import { CommunityPost, CommunityPostComment, CommunityPostLike, Company } from '@/shared/models';
import { Types } from 'mongoose';

class CommunityRepository {
  async findPosts(filter: any, skip: number, limit: number): Promise<any[]> {
    return CommunityPost.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user_id', 'full_name company_name avatar_url role')
      .populate('tags', 'name')
      .exec();
  }

  async countPosts(filter: any): Promise<number> {
    return CommunityPost.countDocuments(filter).exec();
  }

  async findPostById(id: string): Promise<any> {
    return CommunityPost.findOne({ _id: id, is_visible: true })
      .populate('user_id', 'full_name company_name avatar_url role')
      .populate('tags', 'name')
      .exec();
  }

  async findCommentsByPostId(postId: string): Promise<any[]> {
    return CommunityPostComment.find({ post_id: postId, is_visible: true })
      .sort({ created_at: -1 })
      .populate('user_id', 'full_name company_name avatar_url role')
      .exec();
  }

  async findCommentById(commentId: string): Promise<any> {
    return CommunityPostComment.findById(commentId)
      .populate('user_id', 'full_name company_name avatar_url role')
      .exec();
  }

  async findLike(postId: string, userId: string): Promise<any> {
    return CommunityPostLike.findOne({ post_id: postId, user_id: userId }).exec();
  }

  async findLikesForPosts(userId: string, postIds: string[]): Promise<any[]> {
    return CommunityPostLike.find({
      user_id: userId,
      post_id: { $in: postIds.map((id) => new Types.ObjectId(id)) },
    }).exec();
  }

  async createLike(postId: string, userId: string): Promise<any> {
    return CommunityPostLike.create({ post_id: postId, user_id: userId });
  }

  async deleteLike(likeId: string): Promise<any> {
    return CommunityPostLike.deleteOne({ _id: likeId }).exec();
  }

  async incrementLikeCount(postId: string, val: number): Promise<any> {
    return CommunityPost.updateOne({ _id: postId }, { $inc: { like_count: val } }).exec();
  }

  async incrementCommentCount(postId: string, val: number): Promise<any> {
    return CommunityPost.updateOne({ _id: postId }, { $inc: { comment_count: val } }).exec();
  }

  async createPost(data: any): Promise<any> {
    return CommunityPost.create(data);
  }

  async createComment(data: any): Promise<any> {
    return CommunityPostComment.create(data);
  }

  async findUnpatchedPosts(): Promise<any[]> {
    return CommunityPost.find({ user_type: { $exists: false } }).exec();
  }

  async findUnpatchedComments(): Promise<any[]> {
    return CommunityPostComment.find({ user_type: { $exists: false } }).exec();
  }

  async checkCompanyExists(id: string): Promise<boolean> {
    const exists = await Company.exists({ _id: id });
    return !!exists;
  }
}

export const communityRepository = new CommunityRepository();
