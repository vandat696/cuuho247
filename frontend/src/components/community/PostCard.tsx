import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar } from '@mui/material';
import { ThumbUpOutlined, ChatBubbleOutline } from '@mui/icons-material';
import { CommunityPost, communityService } from '../../services/community.service';
import { formatRelativeTime } from '../../utils/date';
import { CARD_RADIUS, ORANGE } from '../../constants/colors';
import { getUploadImageUrl } from '../../utils/url';

interface PostCardProps {
  post: CommunityPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(!!post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);

  const authorName = post.author_name || post.user_id?.company_name || post.user_id?.full_name || '';
  const authorAvatar = post.author_avatar || post.user_id?.avatar_url || '';

  return (
    <Box
      onClick={() => navigate(`/community/${post._id}`)}
      sx={{
        bgcolor: '#fff',
        borderRadius: CARD_RADIUS,
        p: 2,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        border: '1px solid #f1f5f9',
        transition: 'transform 0.2s',
        '&:active': { transform: 'scale(0.98)' },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar src={authorAvatar} alt={authorName} sx={{ width: 40, height: 40, mr: 1.5 }} />
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{authorName}</Typography>
          <Typography sx={{ fontSize: 12, color: '#64748b' }}>{formatRelativeTime(post.created_at)}</Typography>
        </Box>
      </Box>

      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 1, color: '#0f172a' }}>{post.title}</Typography>

      <Typography
        sx={{
          fontSize: 14,
          color: '#475569',
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.content}
      </Typography>

      {post.images && post.images.length > 0 && (
        <Box sx={{ mb: 2, width: '100%', height: 180, borderRadius: '8px', overflow: 'hidden', bgcolor: '#f8fafc' }}>
          <Box
            component="img"
            src={getUploadImageUrl(post.images[0])}
            alt="Post image"
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      )}

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, pt: 1.5, borderTop: '1px solid #f1f5f9' }}>
        <Box
          component="button"
          onClick={async (e: any) => {
            e.stopPropagation();
            if (!localStorage.getItem('accessToken')) {
              import('react-hot-toast').then(({ toast }) => toast.error('Vui lòng đăng nhập để thích bài viết'));
              return;
            }
            setIsLiked(!isLiked);
            setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
            try {
              await communityService.toggleLike(post._id);
            } catch (error) {
              setIsLiked(isLiked);
              setLikeCount(isLiked ? likeCount : likeCount - 1);
              console.error('Error toggling like:', error);
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: isLiked ? ORANGE : '#64748b',
            bgcolor: 'transparent',
            border: 'none',
            p: 0,
            cursor: 'pointer',
            '&:hover': { color: ORANGE },
          }}
        >
          <ThumbUpOutlined sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{likeCount}</Typography>
        </Box>
        <Box
          component="button"
          onClick={(e: any) => {
            e.stopPropagation();
            navigate(`/community/${post._id}`);
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#64748b',
            bgcolor: 'transparent',
            border: 'none',
            p: 0,
            cursor: 'pointer',
            '&:hover': { color: '#f97316' },
          }}
        >
          <ChatBubbleOutline sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{post.comment_count || 0}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PostCard;
