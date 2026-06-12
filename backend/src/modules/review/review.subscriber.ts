import { reviewEventEmitter, REVIEW_EVENTS } from './review.event';
import { notificationService } from '../notification/notification.service';

// ─── 1. Event: REVIEW_SUBMITTED ────────────────────────────────────────────────
reviewEventEmitter.on(REVIEW_EVENTS.REVIEW_SUBMITTED, async ({ companyId, userId, rating, rescueRequestId }) => {
  try {
    // Notify Company
    await notificationService.createAndSendNotification(
      companyId,
      'company',
      'review_submitted',
      'Đánh giá mới',
      `Bạn đã nhận được đánh giá ${rating} sao mới từ khách hàng cho yêu cầu #${rescueRequestId.slice(-4)}.`,
      { rescue_request_id: rescueRequestId }
    );

    // Notify Customer
    await notificationService.createAndSendNotification(
      userId,
      'user',
      'review_submitted',
      'Đánh giá đã được gửi',
      'Cảm ơn bạn đã đánh giá dịch vụ của chúng tôi.',
      { rescue_request_id: rescueRequestId }
    );
  } catch (err) {
    console.error('Error creating review notifications:', err);
  }
});

// ─── 2. Event: REVIEW_REPLIED ──────────────────────────────────────────────────
reviewEventEmitter.on(REVIEW_EVENTS.REVIEW_REPLIED, async ({ userId, rescueRequestId }) => {
  try {
    if (userId) {
      await notificationService.createAndSendNotification(
        userId,
        'user',
        'review_replied',
        'Phản hồi đánh giá',
        `Đơn vị cứu hộ đã phản hồi đánh giá của bạn cho yêu cầu #${rescueRequestId.slice(-4)}.`,
        { rescue_request_id: rescueRequestId }
      );
    }
  } catch (err) {
    console.error('Error creating review reply notification:', err);
  }
});
