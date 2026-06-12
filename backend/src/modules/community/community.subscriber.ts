import { communityEventEmitter, COMMUNITY_EVENTS } from './community.event';
import { notificationService } from '../notification/notification.service';

communityEventEmitter.on(COMMUNITY_EVENTS.COMMENT_ADDED, async ({ post, comment, userId, content }) => {
  try {
    const postAuthorId = post.user_id?._id ? post.user_id._id.toString() : post.user_id?.toString();

    if (postAuthorId && postAuthorId !== userId) {
      const author = comment.user_id;
      const commenterName = author
        ? author.company_name || author.full_name || 'Thành viên cộng đồng'
        : 'Thành viên cộng đồng';

      const recipientType = post.user_type === 'Company' ? 'company' : 'user';

      await notificationService.createAndSendNotification(
        postAuthorId,
        recipientType,
        'new_comment',
        'Bình luận mới',
        `${commenterName} đã bình luận về bài viết của bạn: "${content.slice(0, 30)}${content.length > 30 ? '...' : ''}"`,
        { post_id: post._id.toString() }
      );
    }
  } catch (err) {
    console.error('[Subscriber] Error creating new_comment notification:', err);
  }
});
