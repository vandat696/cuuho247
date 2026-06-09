import { http as api } from './http';

export interface User {
  _id: string;
  full_name: string;
  avatar_url?: string;
  role: string;
}

export interface Tag {
  _id: string;
  name: string;
}

export interface CommunityPost {
  _id: string;
  user_id: User;
  title: string;
  content: string;
  images?: string[];
  tags?: Tag[];
  like_count: number;
  comment_count: number;
  created_at: string;
  is_liked?: boolean;
}

export interface CommunityComment {
  _id: string;
  post_id: string;
  user_id: User;
  content: string;
  created_at: string;
}

export interface PostDetails extends CommunityPost {
  comments: CommunityComment[];
  is_liked: boolean;
}

export const communityService = {
  getPosts: async (params?: { page?: number; limit?: number; tagId?: string; search?: string }) => {
    const response = await api.get('/community', { params });
    return response.data;
  },

  getPostDetails: async (id: string) => {
    const response = await api.get(`/community/${id}`);
    return response.data.data;
  },

  createPost: async (formData: FormData) => {
    const response = await api.post('/community', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  toggleLike: async (id: string) => {
    const response = await api.post(`/community/${id}/like`);
    return response.data;
  },

  addComment: async (id: string, content: string) => {
    const response = await api.post(`/community/${id}/comments`, { content });
    return response.data.data;
  },
};
