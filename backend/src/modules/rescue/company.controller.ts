import { Request, Response, NextFunction } from 'express';
import companyRescueRequestService from './company.service';
import { AuthRequest } from '@/shared/middleware/auth.middleware';
import { acceptRequestSchema, completeRequestSchema } from './rescue.validator';
import { validateSchema } from '../../shared/utils/validation.util';
import { NotFoundError, BadRequestError } from '../../shared/utils/apiError.util';
import { rescueEventEmitter, RESCUE_EVENTS } from './rescue.event';

class RescueCompanyController {
  async getCompanyActiveRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const requests = await companyRescueRequestService.getActiveRequestsForCompany(companyId);

      res.status(200).json({
        status: 'success',
        message: 'Lấy danh sách nhiệm vụ đang thực hiện thành công',
        data: {
          total: requests.length,
          requests,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyActiveRequestDetail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const request = await companyRescueRequestService.getActiveRequestDetailForCompany(companyId, requestId);

      if (!request) {
        throw new NotFoundError('Không tìm thấy nhiệm vụ đang thực hiện');
      }

      res.status(200).json({
        status: 'success',
        message: 'Lấy chi tiết nhiệm vụ đang thực hiện thành công',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyCompletedRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const requests = await companyRescueRequestService.getCompletedRequestsForCompany(companyId);

      res.status(200).json({
        status: 'success',
        message: 'Lấy danh sách nhiệm vụ đã hoàn thành thành công',
        data: { total: requests.length, requests },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyCompletedRequestDetail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const request = await companyRescueRequestService.getCompletedRequestDetailForCompany(companyId, requestId);

      if (!request) {
        throw new NotFoundError('Không tìm thấy nhiệm vụ đã hoàn thành');
      }

      res.status(200).json({
        status: 'success',
        message: 'Lấy chi tiết nhiệm vụ đã hoàn thành thành công',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyCanceledRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const requests = await companyRescueRequestService.getCanceledRequestsForCompany(companyId);

      res.status(200).json({
        status: 'success',
        message: 'Lấy danh sách nhiệm vụ đã hủy thành công',
        data: { total: requests.length, requests },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyCanceledRequestDetail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const request = await companyRescueRequestService.getCanceledRequestDetailForCompany(companyId, requestId);

      if (!request) {
        throw new NotFoundError('Không tìm thấy nhiệm vụ đã hủy');
      }

      res.status(200).json({
        status: 'success',
        message: 'Lấy chi tiết nhiệm vụ đã hủy thành công',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyPendingRequests(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const requests = await companyRescueRequestService.getPendingRequestsForCompany(companyId);

      res.status(200).json({
        status: 'success',
        message: 'Lấy danh sách yêu cầu đang chờ thành công',
        data: { total: requests.length, requests },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyPendingRequestDetail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const request = await companyRescueRequestService.getPendingRequestDetailForCompany(companyId, requestId);

      if (!request) {
        throw new NotFoundError('Không tìm thấy yêu cầu đang chờ');
      }

      res.status(200).json({
        status: 'success',
        message: 'Lấy chi tiết yêu cầu đang chờ thành công',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptCompanyPendingRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const value = validateSchema<any>(acceptRequestSchema, req.body, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
        formatErrors: 'object',
      });

      const request = await companyRescueRequestService.acceptPendingRequestForCompany(companyId, requestId, value);

      if (!request) {
        throw new NotFoundError('Không tìm thấy yêu cầu đang chờ để nhận');
      }

      // Emit domain event for side-effects (Socket.io & Notifications)
      rescueEventEmitter.emit(RESCUE_EVENTS.REQUEST_ACCEPTED, {
        request,
        companyId,
        io: req.app.get('io'),
      });

      res.status(200).json({
        status: 'success',
        message: 'Nhận yêu cầu cứu hộ thành công',
        data: { request },
      });
    } catch (error: any) {
      if (error.message.includes('Xe cứu hộ') || error.message.includes('Xe cuu ho')) {
        next(new BadRequestError(error.message));
        return;
      }
      next(error);
    }
  }

  async completeCompanyActiveRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const value = validateSchema<any>(completeRequestSchema, req.body, {
        abortEarly: false,
        customMessage: 'Dữ liệu không hợp lệ',
        formatErrors: 'object',
      });

      const request = await companyRescueRequestService.completeActiveRequestForCompany(companyId, requestId, value);

      if (!request) {
        throw new NotFoundError('Không tìm thấy nhiệm vụ để hoàn tất');
      }

      // Emit domain event for side-effects (Socket.io & Notifications)
      rescueEventEmitter.emit(RESCUE_EVENTS.REQUEST_COMPLETED, {
        request,
        companyId,
        io: req.app.get('io'),
      });

      res.status(200).json({
        status: 'success',
        message: 'Hoàn tất và chốt thanh toán thành công',
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  async startCompanyActiveRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;

      const request = await companyRescueRequestService.startActiveRequestForCompany(companyId, requestId);

      if (!request) {
        throw new NotFoundError('Không tìm thấy nhiệm vụ để bắt đầu');
      }

      // Emit domain event for side-effects (Socket.io & Notifications)
      rescueEventEmitter.emit(RESCUE_EVENTS.REQUEST_IN_PROGRESS, {
        request,
        companyId,
        io: req.app.get('io'),
      });

      res.status(200).json({
        status: 'success',
        message: 'Bắt đầu di chuyển thành công',
        data: { request },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async arriveCompanyActiveRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;

      const request = await companyRescueRequestService.arriveActiveRequestForCompany(companyId, requestId);

      if (!request) {
        throw new NotFoundError('Không tìm thấy nhiệm vụ để xác nhận đến nơi');
      }

      // Emit domain event for side-effects (Socket.io & Notifications)
      rescueEventEmitter.emit(RESCUE_EVENTS.REQUEST_ARRIVED, {
        request,
        companyId,
        io: req.app.get('io'),
      });

      res.status(200).json({
        status: 'success',
        message: 'Đã cập nhật trạng thái xe đến nơi',
        data: { request },
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getCompanyRequestRouteEstimate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const { lat, lng } = req.query;

      if ((lat && !lng) || (!lat && lng)) {
        throw new BadRequestError('Vui lòng gửi đủ cả lat và lng');
      }

      const origin =
        lat && lng
          ? {
              lat: parseFloat(lat as string),
              lng: parseFloat(lng as string),
            }
          : undefined;

      if (origin && (Number.isNaN(origin.lat) || Number.isNaN(origin.lng))) {
        throw new BadRequestError('Tọa độ không hợp lệ');
      }

      const estimate = await companyRescueRequestService.estimateRequestRouteForCompany(companyId, requestId, origin);

      if (!estimate) {
        throw new NotFoundError('Không tìm thấy yêu cầu để tính thời gian di chuyển');
      }

      res.status(200).json({ status: 'success', data: { estimate } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/rescue/companies
   * Query params: lat, lng, incident_type, max_distance_km
   */
  async searchCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { lat, lng, incident_type, max_distance_km } = req.query;

      if (!lat || !lng) {
        throw new BadRequestError('Vị trí (lat, lng) là bắt buộc');
      }

      const results = await companyRescueRequestService.searchNearbyCompanies({
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
        incident_type: incident_type as string,
        max_distance_km: max_distance_km ? parseFloat(max_distance_km as string) : undefined,
      });

      res.status(200).json({
        status: 'success',
        data: { total: results.length, companies: results },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RescueCompanyController();
