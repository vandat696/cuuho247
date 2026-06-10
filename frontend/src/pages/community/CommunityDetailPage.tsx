import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ThumbUpOutlined, ChatBubbleOutline, Send } from '@mui/icons-material';
import { Box, Typography, Avatar, IconButton, InputBase, CircularProgress } from '@mui/material';
import { communityService, PostDetails } from '../../services/community.service';
import { formatRelativeTime } from '../../utils/date';
import { AppHeader } from '../../components/layout/AppHeader';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { toast } from 'react-hot-toast';
import { ORANGE, CARD_RADIUS, BUTTON_RADIUS } from '../../constants/colors';

const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isAuthenticated = !!localStorage.getItem('accessToken');
  const [post, setPost] = useState<PostDetails | null>(null);
  const [commentContent, setCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const fetchPostDetails = async () => {
    try {
      const response = await communityService.getPostDetails(id!);
      setPost(response);
    } catch (error) {
      toast.error('Không thể tải bài viết');
      navigate('/community');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thích bài viết');
      return;
    }

    try {
      await communityService.toggleLike(id!);
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          is_liked: !prev.is_liked,
          like_count: prev.is_liked ? prev.like_count - 1 : prev.like_count + 1,
        };
      });
    } catch (error) {
      console.error('Error toggling like', error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để bình luận');
      return;
    }
    if (!commentContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await communityService.addComment(id!, commentContent);
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          comment_count: prev.comment_count + 1,
          comments: [response, ...prev.comments],
        };
      });
      setCommentContent('');
    } catch (error) {
      toast.error('Không thể gửi bình luận');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MobileLayout>
        <AppHeader title="Chi tiết bài viết" showBack onBack={() => navigate(-1)} />
        <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: ORANGE }} />
        </Box>
      </MobileLayout>
    );
  }

  if (!post) return null;

  return (
    <MobileLayout>
      <AppHeader title="Chi tiết bài viết" showBack onBack={() => navigate(-1)} />

      <Box sx={{ flex: 1, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', height: '0px' }}>
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
          <Box
            sx={{
              bgcolor: '#fff',
              borderRadius: CARD_RADIUS,
              p: 2.5,
              mb: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: '1px solid #f1f5f9',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
              <Avatar
                src={post.author_avatar || post.user_id?.avatar_url || ''}
                alt={post.author_name || ''}
                sx={{ width: 44, height: 44, mr: 1.5 }}
              />
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: 15, color: '#1e293b' }}>
                  {post.author_name || post.user_id?.company_name || post.user_id?.full_name || ''}
                </Typography>
                <Typography sx={{ fontSize: 13, color: '#64748b' }}>{formatRelativeTime(post.created_at)}</Typography>
              </Box>
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: 18, mb: 1.5, color: '#0f172a' }}>{post.title}</Typography>

            <Typography sx={{ fontSize: 15, color: '#334155', mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
              {post.content}
            </Typography>

            {post.images && post.images.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {post.images.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{ width: '100%', borderRadius: BUTTON_RADIUS, overflow: 'hidden', bgcolor: '#f1f5f9' }}
                  >
                    <Box
                      component="img"
                      src={`${import.meta.env.VITE_API_URL}/uploads/${img}`}
                      alt="Post image"
                      sx={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </Box>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {(post.tags || []).map((tag) => (
                <Box
                  key={tag._id}
                  sx={{
                    px: 2,
                    py: 0.5,
                    bgcolor: '#f1f5f9',
                    color: '#475569',
                    borderRadius: '999px',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {tag.name}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, pt: 2, borderTop: '1px solid #f1f5f9' }}>
              <Box
                component="button"
                onClick={handleLike}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: post.is_liked ? ORANGE : '#64748b',
                  cursor: 'pointer',
                  bgcolor: 'transparent',
                  border: 'none',
                  p: 0,
                  '&:hover': { color: ORANGE },
                  transition: 'color 0.2s',
                }}
              >
                <ThumbUpOutlined sx={{ fontSize: 22 }} />
                <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{post.like_count || 0} Thích</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#64748b' }}>
                <ChatBubbleOutline sx={{ fontSize: 22 }} />
                <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{post.comment_count || 0} Bình luận</Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2, color: '#1e293b' }}>
              Bình luận ({post.comment_count})
            </Typography>

            {post.comments.length === 0 ? (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  bgcolor: '#fff',
                  borderRadius: CARD_RADIUS,
                  border: '1px solid #f1f5f9',
                }}
              >
                <Typography sx={{ color: '#94a3b8', fontSize: 14 }}>
                  Chưa có bình luận nào. Hãy là người đầu tiên!
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {post.comments.map((comment) => (
                  <Box key={comment._id} sx={{ display: 'flex', gap: 1.5 }}>
                    <Avatar
                      src={comment.author_avatar || comment.user_id?.avatar_url || ''}
                      alt={comment.author_name || ''}
                      sx={{ width: 36, height: 36 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Box
                        sx={{ bgcolor: '#fff', p: 1.5, borderRadius: '0 12px 12px 12px', border: '1px solid #f1f5f9' }}
                      >
                        <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1e293b', mb: 0.5 }}>
                          {comment.author_name || comment.user_id?.company_name || comment.user_id?.full_name || ''}
                        </Typography>
                        <Typography sx={{ fontSize: 14, color: '#334155', whiteSpace: 'pre-wrap' }}>
                          {comment.content}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, color: '#94a3b8', mt: 0.5, ml: 1 }}>
                        {formatRelativeTime(comment.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        <Box
          component="form"
          onSubmit={handleCommentSubmit}
          sx={{
            p: 2,
            bgcolor: '#fff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: 1.5,
            alignItems: 'flex-end',
          }}
        >
          <InputBase
            multiline
            maxRows={4}
            placeholder="Viết bình luận..."
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            sx={{ flex: 1, bgcolor: '#f1f5f9', borderRadius: BUTTON_RADIUS, px: 2, py: 1.5, fontSize: 15 }}
          />
          <IconButton
            type="submit"
            disabled={!commentContent.trim() || isSubmitting}
            sx={{
              bgcolor: ORANGE,
              color: '#fff',
              width: 44,
              height: 44,
              borderRadius: '50%',
              '&:hover': { bgcolor: '#e66000' },
              '&.Mui-disabled': { bgcolor: '#fdb482', color: '#fff' },
            }}
          >
            <Send sx={{ fontSize: 20, ml: '4px' }} />
          </IconButton>
        </Box>
      </Box>
    </MobileLayout>
  );
};

export default CommunityDetailPage;
