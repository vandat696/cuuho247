import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Avatar,
  Rating,
  Tabs,
  Tab,
  Collapse,
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  Restore as RestoreIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ChatBubbleOutline as CommentIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { adminService } from '@/services/admin.service';
import { formatDateTime } from '@/utils/format';
import { NAVY, CARD_RADIUS } from '@/constants/colors';

// ─── Remove Dialog ───────────────────────────────────────────────────────────
interface RemoveDialogProps {
  open: boolean;
  type: 'review' | 'reply' | 'post' | 'comment';
  loading: boolean;
  reason: string;
  onReasonChange: (v: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

function RemoveDialog({ open, type, loading, reason, onReasonChange, onConfirm, onClose }: RemoveDialogProps) {
  const labels: Record<string, string> = {
    review: 'đánh giá',
    reply: 'phản hồi',
    post: 'bài viết',
    comment: 'bình luận',
  };
  return (
    <Dialog open={open} onClose={() => !loading && onClose()} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>Gỡ {labels[type]}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: '#4b5563' }}>
          Nội dung này sẽ không còn hiển thị công khai. Vui lòng nhập lý do để lưu log.
        </Typography>
        <TextField
          autoFocus
          label="Lý do gỡ nội dung"
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          disabled={loading}
          size="small"
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button variant="outline" onClick={onClose} disabled={loading}>
          Hủy
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          loading={loading}
          sx={{ bgcolor: 'error.main', '&:hover': { bgcolor: 'error.dark' } }}
        >
          Xác nhận gỡ
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Status Chip ──────────────────────────────────────────────────────────────
function StatusChip({ visible }: { visible: boolean }) {
  return visible ? (
    <Chip label="Hiển thị" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 700, fontSize: 11 }} />
  ) : (
    <Chip label="Đã gỡ" size="small" sx={{ bgcolor: '#fee2e2', color: '#991b1b', fontWeight: 700, fontSize: 11 }} />
  );
}

// ─── Reviews Tab ──────────────────────────────────────────────────────────────
function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: 'review' | 'reply';
    target: any;
    reason: string;
    loading: boolean;
  }>({ open: false, type: 'review', target: null, reason: '', loading: false });

  const limit = 15;

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getReviews(limit, page);
      if (res.status === 'success') {
        setReviews(res.data.reviews);
        setTotal(res.data.total);
      }
    } catch {
      toast.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const openRemove = (review: any, type: 'review' | 'reply') =>
    setDialog({ open: true, type, target: review, reason: '', loading: false });

  const handleConfirmRemove = async () => {
    if (!dialog.reason.trim()) {
      toast.error('Vui lòng nhập lý do gỡ');
      return;
    }
    setDialog((d) => ({ ...d, loading: true }));
    try {
      if (dialog.type === 'review') {
        await adminService.removeReview(dialog.target._id, dialog.reason);
        toast.success('Gỡ đánh giá thành công');
      } else {
        await adminService.removeReviewReply(dialog.target._id, dialog.reason);
        toast.success('Gỡ phản hồi thành công');
      }
      setDialog((d) => ({ ...d, open: false }));
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi gỡ nội dung');
      setDialog((d) => ({ ...d, loading: false }));
    }
  };

  const handleRestore = async (review: any, type: 'review' | 'reply') => {
    try {
      if (type === 'review') {
        await adminService.restoreReview(review._id);
        toast.success('Khôi phục đánh giá thành công');
      } else {
        await adminService.restoreReviewReply(review._id);
        toast.success('Khôi phục phản hồi thành công');
      }
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi khôi phục nội dung');
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Typography sx={{ mb: 2, fontSize: 15, fontWeight: 800, color: NAVY }}>Tổng số: {total} đánh giá</Typography>

      {reviews.length === 0 ? (
        <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
          <Typography sx={{ fontSize: 14 }}>Không có đánh giá nào trên hệ thống.</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {reviews.map((review) => (
              <Box
                key={review._id}
                sx={{ p: 2, border: '2px solid #e5e7eb', borderRadius: CARD_RADIUS, bgcolor: '#fff' }}
              >
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <Avatar src={review.user_id?.avatar_url} sx={{ width: 36, height: 36 }} />
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                        {review.user_id?.full_name || 'Khách hàng'}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
                        {formatDateTime(review.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StatusChip visible={review.is_visible} />
                    {review.is_visible ? (
                      <IconButton size="small" color="error" onClick={() => openRemove(review, 'review')}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    ) : (
                      <IconButton size="small" color="primary" onClick={() => handleRestore(review, 'review')}>
                        <RestoreIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                {/* Company + Rating */}
                <Typography sx={{ fontSize: 13, color: '#4b5563', mb: 0.5 }}>
                  <strong>Công ty cứu hộ:</strong> {review.company_id?.company_name || 'Không xác định'}
                </Typography>
                <Rating value={review.rating} readOnly size="small" sx={{ color: '#f59e0b', mb: 1 }} />

                {/* Content */}
                {review.content && (
                  <Box sx={{ bgcolor: '#f9fafb', p: 1.5, borderRadius: '8px', mb: 1 }}>
                    <Typography sx={{ fontSize: 13, color: '#374151' }}>{review.content}</Typography>
                  </Box>
                )}

                {/* Reply */}
                {review.reply?.content && (
                  <Box
                    sx={{
                      ml: 2,
                      p: 1.5,
                      borderRadius: '8px',
                      bgcolor: review.reply.is_visible === false ? '#fef2f2' : '#f0fdf4',
                      border: `1px solid ${review.reply.is_visible === false ? '#fecaca' : '#bbf7d0'}`,
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: review.reply.is_visible === false ? '#991b1b' : '#166534',
                        }}
                      >
                        Phản hồi từ công ty cứu hộ
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StatusChip visible={review.reply.is_visible !== false} />
                        {review.reply.is_visible !== false ? (
                          <IconButton size="small" color="error" onClick={() => openRemove(review, 'reply')}>
                            <DeleteIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        ) : (
                          <IconButton size="small" color="primary" onClick={() => handleRestore(review, 'reply')}>
                            <RestoreIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        )}
                      </Box>
                    </Box>
                    <Typography sx={{ fontSize: 13, color: review.reply.is_visible === false ? '#991b1b' : '#14532d' }}>
                      {review.reply.content}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </>
      )}

      <RemoveDialog
        open={dialog.open}
        type={dialog.type}
        loading={dialog.loading}
        reason={dialog.reason}
        onReasonChange={(v) => setDialog((d) => ({ ...d, reason: v }))}
        onConfirm={handleConfirmRemove}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
      />
    </>
  );
}

// ─── Community Tab ────────────────────────────────────────────────────────────
function CommunityTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [postComments, setPostComments] = useState<Record<string, any[]>>({});
  const [loadingComments, setLoadingComments] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<{
    open: boolean;
    type: 'post' | 'comment';
    target: any;
    reason: string;
    loading: boolean;
  }>({ open: false, type: 'post', target: null, reason: '', loading: false });

  const limit = 10;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminService.getCommunityPosts(search || undefined, page, limit);
      if (res.status === 'success') {
        setPosts(res.data.posts);
        setTotal(res.data.total);
      }
    } catch {
      toast.error('Lỗi khi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPosts(), 400);
    return () => clearTimeout(timer);
  }, [fetchPosts]);

  const toggleExpand = async (postId: string, commentCount: number) => {
    const next = new Set(expandedPosts);
    if (next.has(postId)) {
      next.delete(postId);
    } else {
      next.add(postId);
      // Load all comments (including hidden) via admin endpoint
      if (!postComments[postId] && commentCount > 0) {
        setLoadingComments((prev) => new Set(prev).add(postId));
        try {
          const res = await adminService.getPostComments(postId);
          if (res.status === 'success') {
            setPostComments((prev) => ({ ...prev, [postId]: res.data }));
          }
        } catch {
          toast.error('Không thể tải bình luận');
        } finally {
          setLoadingComments((prev) => {
            const next2 = new Set(prev);
            next2.delete(postId);
            return next2;
          });
        }
      }
    }
    setExpandedPosts(next);
  };

  const openRemovePost = (post: any) =>
    setDialog({ open: true, type: 'post', target: post, reason: '', loading: false });

  const openRemoveComment = (comment: any) =>
    setDialog({ open: true, type: 'comment', target: comment, reason: '', loading: false });

  const handleConfirmRemove = async () => {
    if (!dialog.reason.trim()) {
      toast.error('Vui lòng nhập lý do gỡ');
      return;
    }
    setDialog((d) => ({ ...d, loading: true }));
    try {
      if (dialog.type === 'post') {
        await adminService.removePost(dialog.target._id, dialog.reason);
        toast.success('Gỡ bài viết thành công');
        fetchPosts();
      } else {
        await adminService.removeComment(dialog.target._id, dialog.reason);
        toast.success('Gỡ bình luận thành công');
        // Update comment in local state
        const postId = dialog.target.post_id;
        setPostComments((prev) => ({
          ...prev,
          [postId]: (prev[postId] || []).map((c: any) =>
            c._id === dialog.target._id ? { ...c, is_visible: false } : c
          ),
        }));
      }
      setDialog((d) => ({ ...d, open: false }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi gỡ nội dung');
      setDialog((d) => ({ ...d, loading: false }));
    }
  };

  const handleRestorePost = async (post: any) => {
    try {
      await adminService.restorePost(post._id);
      toast.success('Khôi phục bài viết thành công');
      fetchPosts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi khôi phục');
    }
  };

  const handleRestoreComment = async (comment: any) => {
    try {
      await adminService.restoreComment(comment._id);
      toast.success('Khôi phục bình luận thành công');
      const postId = comment.post_id;
      setPostComments((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((c: any) => (c._id === comment._id ? { ...c, is_visible: true } : c)),
      }));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Lỗi khi khôi phục');
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <Input
          placeholder="Tìm theo tiêu đề hoặc nội dung..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          leftIcon={<SearchIcon sx={{ color: '#9ca3af' }} />}
        />
      </Box>

      <Typography sx={{ mb: 2, fontSize: 15, fontWeight: 800, color: NAVY }}>Kết quả: {total} bài viết</Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : posts.length === 0 ? (
        <Box sx={{ py: 5, textAlign: 'center', color: '#6b7280' }}>
          <Typography sx={{ fontSize: 14 }}>Không tìm thấy bài viết nào.</Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {posts.map((post) => {
              const isExpanded = expandedPosts.has(post._id);
              const comments = postComments[post._id] || [];
              const isLoadingCmts = loadingComments.has(post._id);
              return (
                <Box
                  key={post._id}
                  sx={{ border: '2px solid #e5e7eb', borderRadius: CARD_RADIUS, bgcolor: '#fff', overflow: 'hidden' }}
                >
                  {/* Post header */}
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flex: 1, minWidth: 0 }}>
                        <Avatar src={post.user_id?.avatar_url} sx={{ width: 36, height: 36, flexShrink: 0 }} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                            {post.user_id?.full_name || 'Người dùng'}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
                            {formatDateTime(post.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                        <StatusChip visible={post.is_visible !== false} />
                        {post.is_visible !== false ? (
                          <IconButton size="small" color="error" onClick={() => openRemovePost(post)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        ) : (
                          <IconButton size="small" color="primary" onClick={() => handleRestorePost(post)}>
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        )}
                      </Box>
                    </Box>

                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#111827', mb: 0.5 }}>
                      {post.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: '#4b5563',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.content}
                    </Typography>

                    {/* Expand button */}
                    {post.comment_count > 0 && (
                      <Box
                        onClick={() => toggleExpand(post._id, post.comment_count)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          mt: 1.5,
                          cursor: 'pointer',
                          color: NAVY,
                          width: 'fit-content',
                        }}
                      >
                        <CommentIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{post.comment_count} bình luận</Typography>
                        {isExpanded ? (
                          <ExpandLessIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <ExpandMoreIcon sx={{ fontSize: 16 }} />
                        )}
                      </Box>
                    )}
                  </Box>

                  {/* Comments section */}
                  <Collapse in={isExpanded}>
                    <Box sx={{ borderTop: '1px solid #f3f4f6', bgcolor: '#f9fafb', p: 2 }}>
                      {isLoadingCmts ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                          <CircularProgress size={20} />
                        </Box>
                      ) : comments.length === 0 ? (
                        <Typography sx={{ fontSize: 13, color: '#9ca3af', textAlign: 'center' }}>
                          Không có bình luận nào.
                        </Typography>
                      ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {comments.map((comment: any) => (
                            <Box
                              key={comment._id}
                              sx={{
                                p: 1.5,
                                borderRadius: '8px',
                                bgcolor: comment.is_visible === false ? '#fef2f2' : '#fff',
                                border: `1px solid ${comment.is_visible === false ? '#fecaca' : '#e5e7eb'}`,
                              }}
                            >
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                  <Avatar src={comment.user_id?.avatar_url} sx={{ width: 28, height: 28 }} />
                                  <Box>
                                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                      {comment.user_id?.full_name || 'Người dùng'}
                                    </Typography>
                                    <Typography sx={{ fontSize: 11, color: '#9ca3af' }}>
                                      {formatDateTime(comment.created_at)}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <StatusChip visible={comment.is_visible !== false} />
                                  {comment.is_visible !== false ? (
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => openRemoveComment({ ...comment, post_id: post._id })}
                                    >
                                      <DeleteIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  ) : (
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleRestoreComment({ ...comment, post_id: post._id })}
                                    >
                                      <RestoreIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                  )}
                                </Box>
                              </Box>
                              <Typography sx={{ fontSize: 13, color: '#374151', mt: 0.75 }}>
                                {comment.content}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
          </Box>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
              <Pagination count={totalPages} page={page} onChange={(_, v) => setPage(v)} color="primary" />
            </Box>
          )}
        </>
      )}

      <RemoveDialog
        open={dialog.open}
        type={dialog.type}
        loading={dialog.loading}
        reason={dialog.reason}
        onReasonChange={(v) => setDialog((d) => ({ ...d, reason: v }))}
        onConfirm={handleConfirmRemove}
        onClose={() => setDialog((d) => ({ ...d, open: false }))}
      />
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminReviewsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        indicatorColor="secondary"
        textColor="secondary"
        sx={{
          mb: 3,
          borderBottom: '1px solid #e5e7eb',
          '& .MuiTab-root': { fontWeight: 700, fontSize: 14, py: 1.5 },
        }}
      >
        <Tab label="Đánh giá & Phản hồi" id="tab-reviews" />
        <Tab label="Bài viết Cộng đồng" id="tab-community" />
      </Tabs>

      {activeTab === 0 ? <ReviewsTab /> : <CommunityTab />}
    </>
  );
}
