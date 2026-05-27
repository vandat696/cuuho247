import { Request, Response, NextFunction } from 'express';
import companyRescueRequestService from '../services/RescueRequestCompany.service';
import { AuthRequest } from '../middleware/auth.middleware';
import { acceptRequestSchema, completeRequestSchema } from '../validators/rescueRequest.validator';

class RescueController {
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
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy nhiệm vụ đang thực hiện',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Lấy chi tiết nhiệm vụ đang thực hiện thành công',
        data: {
          request,
        },
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
        data: {
          total: requests.length,
          requests,
        },
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
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy nhiệm vụ đã hoàn thành',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Lấy chi tiết nhiệm vụ đã hoàn thành thành công',
        data: {
          request,
        },
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
        data: {
          total: requests.length,
          requests,
        },
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
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy nhiệm vụ đã hủy',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Lấy chi tiết nhiệm vụ đã hủy thành công',
        data: {
          request,
        },
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
        data: {
          total: requests.length,
          requests,
        },
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
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy yêu cầu đang chờ',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Lấy chi tiết yêu cầu đang chờ thành công',
        data: {
          request,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async acceptCompanyPendingRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const { error, value } = acceptRequestSchema.validate(req.body, { abortEarly: false });

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

      const request = await companyRescueRequestService.acceptPendingRequestForCompany(companyId, requestId, value);

      if (!request) {
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy yêu cầu đang chờ để nhận',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Nhận yêu cầu cứu hộ thành công',
        data: {
          request,
        },
      });
    } catch (error: any) {
      if (error.message.includes('Xe cứu hộ') || error.message.includes('Xe cuu ho')) {
        res.status(400).json({ status: 'error', message: error.message });
        return;
      }
      next(error);
    }
  }

  async completeCompanyActiveRequest(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const { error, value } = completeRequestSchema.validate(req.body, { abortEarly: false });

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

      const request = await companyRescueRequestService.completeActiveRequestForCompany(companyId, requestId, value);

      if (!request) {
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy nhiệm vụ để hoàn tất',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        message: 'Hoàn tất và chốt thanh toán thành công',
        data: {
          request,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyRequestRouteEstimate(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user.id;
      const { requestId } = req.params;
      const { lat, lng } = req.query;

      if ((lat && !lng) || (!lat && lng)) {
        res.status(400).json({
          status: 'error',
          message: 'Vui long gui du ca lat va lng',
        });
        return;
      }

      const origin =
        lat && lng
          ? {
              lat: parseFloat(lat as string),
              lng: parseFloat(lng as string),
            }
          : undefined;

      if (origin && (Number.isNaN(origin.lat) || Number.isNaN(origin.lng))) {
        res.status(400).json({
          status: 'error',
          message: 'Tọa độ không hợp lệ',
        });
        return;
      }

      const estimate = await companyRescueRequestService.estimateRequestRouteForCompany(companyId, requestId, origin);

      if (!estimate) {
        res.status(404).json({
          status: 'error',
          message: 'Không tìm thấy yêu cầu để tính thời gian di chuyển',
        });
        return;
      }

      res.status(200).json({
        status: 'success',
        data: {
          estimate,
        },
      });
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
        res.status(400).json({
          status: 'error',
          message: 'Vị trí (lat, lng) là bắt buộc',
        });
        return;
      }

      const results = await companyRescueRequestService.searchNearbyCompanies({
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
        incident_type: incident_type as string,
        max_distance_km: max_distance_km ? parseFloat(max_distance_km as string) : undefined,
      });

      res.status(200).json({
        status: 'success',
        data: {
          total: results.length,
          companies: results,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new RescueController();
