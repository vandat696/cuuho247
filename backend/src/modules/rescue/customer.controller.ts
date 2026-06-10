import { Response, NextFunction } from 'express';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import rescueRequestService from './customer.service';
import { cancelRequestSchema, createRequestSchema } from './rescue.validator';
import { notificationService } from '../notification/notification.service';

class RescueCustomerController {
  async getMyRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const requests = await rescueRequestService.getRequestsForUser(req.user.id);

      res.status(200).json({
        status: 'success',
        message: 'Lấy danh sách yêu cầu cứu hộ của bạn thành công',
        data: {
          total: requests.length,
          requests,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async createRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = createRequestSchema.validate(req.body, { abortEarly: false });
      if (error) {
        res.status(400).json({
          status: 'error',
          message: 'Dữ liệu không hợp lệ',
          errors: error.details.map((err) => ({
            field: err.context?.key,
            message: err.message,
          })),
        });
        return;
      }

      const newRequest = await rescueRequestService.createRescueRequest({
        ...value,
        user_id: req.user.id,
      });

      // Notify the company of the new rescue request
      try {
        await notificationService.createAndSendNotification(
          value.company_id,
          'company',
          'request_created',
          'Yêu cầu cứu hộ mới',
          'Bạn có một yêu cầu cứu hộ mới đang chờ xác nhận.',
          { rescue_request_id: newRequest._id.toString() }
        );
      } catch (err) {
        console.error('Error creating request_created notification:', err);
      }

      res.status(201).json({
        status: 'success',
        message: 'Tạo yêu cầu cứu hộ thành công',
        data: newRequest,
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { error, value } = cancelRequestSchema.validate(req.body);
      if (error) {
        res.status(400).json({ status: 'error', message: error.details[0].message });
        return;
      }

      const updated = await rescueRequestService.cancelRequest(id, req.user.id, value.reason);

      const io = req.app.get('io');
      if (io) {
        io.to(`tracking:${id}`).emit('status_changed', {
          rescue_request_id: id,
          status: 'cancelled',
          timestamp: new Date(),
        });
      }

      // Notify the company that the customer canceled the request
      try {
        await notificationService.createAndSendNotification(
          updated.company.company_id.toString(),
          'company',
          'request_cancelled',
          'Yêu cầu đã hủy',
          `Khách hàng đã hủy yêu cầu cứu hộ. Lý do: ${value.reason || 'Không có lý do'}`,
          { rescue_request_id: id }
        );
      } catch (err) {
        console.error('Error creating request_cancelled notification:', err);
      }

      res.status(200).json({
        status: 'success',
        message: 'Yêu cầu cứu hộ đã được hủy',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RescueCustomerController();
