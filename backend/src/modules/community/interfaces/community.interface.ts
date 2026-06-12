export interface ICommunityRepository {
  findPosts(filter: any, skip: number, limit: number): Promise<any[]>;
  countPosts(filter: any): Promise<number>;
  findPostById(id: string): Promise<any>;
  findCommentsByPostId(postId: string): Promise<any[]>;
  findCommentById(commentId: string): Promise<any>;
  findLike(postId: string, userId: string): Promise<any>;
  findLikesForPosts(userId: string, postIds: string[]): Promise<any[]>;
  createLike(postId: string, userId: string): Promise<any>;
  deleteLike(likeId: string): Promise<any>;
  incrementLikeCount(postId: string, val: number): Promise<any>;
  incrementCommentCount(postId: string, val: number): Promise<any>;
  createPost(data: any): Promise<any>;
  createComment(data: any): Promise<any>;
  findUnpatchedPosts(): Promise<any[]>;
  findUnpatchedComments(): Promise<any[]>;
  checkCompanyExists(id: string): Promise<boolean>;
}

export interface ICommunityService {
  getPosts(
    userId: string | undefined,
    query: { page?: number; limit?: number; tagId?: string; search?: string }
  ): Promise<{ posts: any[]; total: number; page: number; limit: number; totalPages: number }>;
  getPostDetails(postId: string, userId: string | undefined): Promise<{ post: any; comments: any[]; isLiked: boolean }>;
  createPost(
    userId: string,
    role: string,
    postData: { title: string; content: string; tags?: string | string[] },
    filenames: string[]
  ): Promise<any>;
  toggleLike(userId: string, role: string, postId: string): Promise<{ message: string }>;
  addComment(userId: string, role: string, postId: string, content: string): Promise<any>;
}
