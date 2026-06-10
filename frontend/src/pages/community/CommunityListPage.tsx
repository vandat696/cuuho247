import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Add as Plus } from '@mui/icons-material';
import { Box, Typography, Button as MuiButton, InputBase, CircularProgress } from '@mui/material';
import { communityService, CommunityPost } from '../../services/community.service';
import { serviceService } from '../../services/service.service';
import PostCard from '../../components/community/PostCard';
import { AppHeader } from '../../components/layout/AppHeader';
import { MobileLayout } from '../../components/layout/MobileLayout';
import { NAVY, ORANGE, CARD_RADIUS, BUTTON_RADIUS } from '../../constants/colors';

const CommunityListPage: React.FC = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [tags, setTags] = useState<{ _id: string; name: string }[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [selectedTag, search]);

  const fetchTags = async () => {
    try {
      const response = await serviceService.getCategories();
      setTags(response.data);
    } catch (error) {
      console.error('Error fetching tags', error);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await communityService.getPosts({
        tagId: selectedTag || undefined,
        search: search || undefined,
      });
      setPosts(data.data);
    } catch (error) {
      console.error('Error fetching posts', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MobileLayout>
      <AppHeader title="Cộng đồng" />

      <Box sx={{ p: 2, flex: 1, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
        {/* Header section */}
        <Box sx={{ bgcolor: NAVY, color: '#fff', borderRadius: CARD_RADIUS, p: 2.5, mb: 2 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5, color: '#fff' }}>
            Chia sẻ trải nghiệm của bạn
          </Typography>
          <Typography sx={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>
            Cùng nhau chia sẻ kinh nghiệm và giúp đỡ cộng đồng người dùng
          </Typography>
        </Box>

        {/* Create button */}
        <MuiButton
          variant="contained"
          fullWidth
          startIcon={<Plus />}
          onClick={() => navigate('/community/create')}
          sx={{
            bgcolor: ORANGE,
            mb: 2,
            py: 1.5,
            borderRadius: BUTTON_RADIUS,
            fontWeight: 700,
            textTransform: 'none',
            fontSize: 16,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#e66000', boxShadow: 'none' },
          }}
        >
          Tạo bài viết mới
        </MuiButton>

        {/* Search */}
        <Box
          sx={{
            position: 'relative',
            mb: 2,
            bgcolor: '#fff',
            borderRadius: BUTTON_RADIUS,
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 0.5,
            border: '1px solid #e2e8f0',
          }}
        >
          <Search sx={{ color: '#94a3b8', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Tìm kiếm bài viết..."
            sx={{ flex: 1, fontSize: 15 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {/* Tags filter */}
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: 1,
            mb: 3,
            pb: 1,
            '::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
          <Box
            component="button"
            onClick={() => setSelectedTag('')}
            sx={{
              whiteSpace: 'nowrap',
              px: 2,
              py: 1,
              borderRadius: '999px',
              fontSize: 14,
              fontWeight: 600,
              border: '1px solid',
              borderColor: selectedTag === '' ? NAVY : '#e2e8f0',
              bgcolor: selectedTag === '' ? NAVY : '#fff',
              color: selectedTag === '' ? '#fff' : '#475569',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Tất cả
          </Box>
          {tags.map((tag) => (
            <Box
              key={tag._id}
              component="button"
              onClick={() => setSelectedTag(tag._id)}
              sx={{
                whiteSpace: 'nowrap',
                px: 2,
                py: 1,
                borderRadius: '999px',
                fontSize: 14,
                fontWeight: 600,
                border: '1px solid',
                borderColor: selectedTag === tag._id ? NAVY : '#e2e8f0',
                bgcolor: selectedTag === tag._id ? NAVY : '#fff',
                color: selectedTag === tag._id ? '#fff' : '#475569',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tag.name}
            </Box>
          ))}
        </Box>

        {/* Posts list */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress size={30} sx={{ color: ORANGE }} />
          </Box>
        ) : posts.length > 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pb: 4 }}>
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#fff', borderRadius: CARD_RADIUS }}>
            <Typography sx={{ color: '#94a3b8', fontSize: 15 }}>Không tìm thấy bài viết nào</Typography>
          </Box>
        )}
      </Box>
    </MobileLayout>
  );
};

export default CommunityListPage;
