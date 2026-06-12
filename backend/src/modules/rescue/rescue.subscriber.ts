import { rescueEventEmitter, RESCUE_EVENTS } from './rescue.event';
import { notificationService } from '../notification/notification.service';

const getCustomerId = (request: any): string => {
  if (!request || !request.user_id) return '';
  return request.user_id._id ? request.user_id._id.toString() : request.user_id.toString();
};

// ─── 1. Event: REQUEST_ACCEPTED ───────────────────────────────────────────────
rescueEventEmitter.on(RESCUE_EVENTS.REQUEST_ACCEPTED, async ({ request, companyId, io }) => {
  const requestId = request._id.toString();

  // Socket emit
  if (io) {
    io.to(`tracking:${requestId}`).emit('status_changed', {
      rescue_request_id: requestId,
      status: 'accepted',
      timestamp: new Date(),
    });
  }

  // Notify customer
  try {
    const customerId = getCustomerId(request);
    if (customerId) {
      await notificationService.createAndSendNotification(
        customerId,
        'user',
        'request_accepted',
        'Yêu cầu cứu hộ được tiếp nhận',
        `Đơn vị cứu hộ đã chấp nhận yêu cầu của bạn. Dự kiến xe sẽ đến sau ${request.eta_minutes || 15} phút.`,
        { rescue_request_id: requestId }
      );
    }
  } catch (err) {
    console.error('Error creating request_accepted notification for customer:', err);
  }

  // Notify company
  try {
    await notificationService.createAndSendNotification(
      companyId,
      'company',
      'request_accepted',
      'Nhận yêu cầu thành công',
      `Bạn đã chấp nhận yêu cầu cứu hộ. Dự kiến đến sau ${request.eta_minutes || 15} phút.`,
      { rescue_request_id: requestId }
    );
  } catch (err) {
    console.error('Error creating request_accepted notification for company:', err);
  }
});

// ─── 2. Event: REQUEST_IN_PROGRESS ────────────────────────────────────────────
rescueEventEmitter.on(RESCUE_EVENTS.REQUEST_IN_PROGRESS, async ({ request, companyId, io }) => {
  const requestId = request._id.toString();

  // Socket emit
  if (io) {
    io.to(`tracking:${requestId}`).emit('status_changed', {
      rescue_request_id: requestId,
      status: 'in_progress',
      timestamp: new Date(),
    });
  }

  // Notify customer
  try {
    const customerId = getCustomerId(request);
    if (customerId) {
      await notificationService.createAndSendNotification(
        customerId,
        'user',
        'request_in_progress',
        'Đội cứu hộ đang di chuyển',
        'Nhân viên cứu hộ đang trên đường đến vị trí của bạn.',
        { rescue_request_id: requestId }
      );
    }
  } catch (err) {
    console.error('Error creating request_in_progress notification for customer:', err);
  }

  // Notify company
  try {
    await notificationService.createAndSendNotification(
      companyId,
      'company',
      'request_in_progress',
      'Bắt đầu di chuyển',
      'Đã xác nhận di chuyển đến vị trí cứu hộ.',
      { rescue_request_id: requestId }
    );
  } catch (err) {
    console.error('Error creating request_in_progress notification for company:', err);
  }
});

// ─── 3. Event: REQUEST_ARRIVED ────────────────────────────────────────────────
rescueEventEmitter.on(RESCUE_EVENTS.REQUEST_ARRIVED, async ({ request, companyId, io }) => {
  const requestId = request._id.toString();

  // Socket emit
  if (io) {
    io.to(`tracking:${requestId}`).emit('status_changed', {
      rescue_request_id: requestId,
      status: 'arrived',
      timestamp: new Date(),
    });
  }

  // Notify customer
  try {
    const customerId = getCustomerId(request);
    if (customerId) {
      await notificationService.createAndSendNotification(
        customerId,
        'user',
        'eta_updated',
        'Xe cứu hộ đã đến nơi',
        'Đội cứu hộ đã có mặt tại vị trí của bạn.',
        { rescue_request_id: requestId }
      );
    }
  } catch (err) {
    console.error('Error creating arrived (eta_updated) notification for customer:', err);
  }

  // Notify company
  try {
    await notificationService.createAndSendNotification(
      companyId,
      'company',
      'eta_updated',
      'Đã đến nơi',
      'Đã xác nhận đến vị trí của khách hàng.',
      { rescue_request_id: requestId }
    );
  } catch (err) {
    console.error('Error creating arrived (eta_updated) notification for company:', err);
  }
});

// ─── 4. Event: REQUEST_COMPLETED ──────────────────────────────────────────────
rescueEventEmitter.on(RESCUE_EVENTS.REQUEST_COMPLETED, async ({ request, companyId, io }) => {
  const requestId = request._id.toString();

  // Socket emit
  if (io) {
    io.to(`tracking:${requestId}`).emit('status_changed', {
      rescue_request_id: requestId,
      status: 'completed',
      timestamp: new Date(),
    });
  }

  // Notify customer
  try {
    const customerId = getCustomerId(request);
    if (customerId) {
      await notificationService.createAndSendNotification(
        customerId,
        'user',
        'request_completed',
        'Cứu hộ hoàn thành',
        `Yêu cầu cứu hộ #${requestId.slice(-4)} đã hoàn thành thành công.`,
        { rescue_request_id: requestId }
      );
    }
  } catch (err) {
    console.error('Error creating request_completed notification for customer:', err);
  }

  // Notify company
  try {
    await notificationService.createAndSendNotification(
      companyId,
      'company',
      'request_completed',
      'Hoàn thành cứu hộ',
      `Nhiệm vụ cứu hộ #${requestId.slice(-4)} đã được hoàn tất thành công.`,
      { rescue_request_id: requestId }
    );
  } catch (err) {
    console.error('Error creating request_completed notification for company:', err);
  }
});

// ─── 5. Event: REQUEST_CREATED ────────────────────────────────────────────────
rescueEventEmitter.on(RESCUE_EVENTS.REQUEST_CREATED, async ({ request, io }) => {
  const requestId = request._id.toString();
  const companyId = request.company.company_id.toString();
  const customerId = getCustomerId(request);

  // Socket emit to company room
  if (io) {
    io.to(`company:${companyId}`).emit('new_rescue_request', {
      rescue_request: request,
    });
  }

  // Notify company
  try {
    await notificationService.createAndSendNotification(
      companyId,
      'company',
      'request_created',
      'Yêu cầu cứu hộ mới',
      'Bạn có một yêu cầu cứu hộ mới đang chờ xác nhận.',
      { rescue_request_id: requestId }
    );
  } catch (err) {
    console.error('Error creating request_created notification for company:', err);
  }

  // Notify customer
  try {
    if (customerId) {
      await notificationService.createAndSendNotification(
        customerId,
        'user',
        'request_created',
        'Gửi yêu cầu cứu hộ thành công',
        'Yêu cầu cứu hộ của bạn đang chờ công ty xác nhận.',
        { rescue_request_id: requestId }
      );
    }
  } catch (err) {
    console.error('Error creating request_created notification for user:', err);
  }
});

// ─── 6. Event: REQUEST_CANCELLED ──────────────────────────────────────────────
rescueEventEmitter.on(RESCUE_EVENTS.REQUEST_CANCELLED, async ({ request, userId, reason, io }) => {
  const requestId = request._id.toString();
  const companyId = request.company.company_id.toString();

  // Socket emit
  if (io) {
    io.to(`tracking:${requestId}`).emit('status_changed', {
      rescue_request_id: requestId,
      status: 'cancelled',
      timestamp: new Date(),
    });
  }

  // Notify company
  try {
    await notificationService.createAndSendNotification(
      companyId,
      'company',
      'request_cancelled',
      'Yêu cầu đã hủy',
      `Khách hàng đã hủy yêu cầu cứu hộ. Lý do: ${reason || 'Không có lý do'}`,
      { rescue_request_id: requestId }
    );
  } catch (err) {
    console.error('Error creating request_cancelled notification for company:', err);
  }

  // Notify customer
  try {
    await notificationService.createAndSendNotification(
      userId,
      'user',
      'request_cancelled',
      'Hủy yêu cầu thành công',
      'Yêu cầu cứu hộ đã được hủy.',
      { rescue_request_id: requestId }
    );
  } catch (err) {
    console.error('Error creating request_cancelled notification for user:', err);
  }
});
