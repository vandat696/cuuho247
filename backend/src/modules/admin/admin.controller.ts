import { Request, Response, NextFunction } from 'express';
import adminService from './admin.service';

class AdminController {
  async getPendingCompanies(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await adminService.getPendingCompanies();
      res.status(200).json({ status: 'success', data: companies });
    } catch (err) {
      next(err);
    }
  }

  async approveCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const company = await adminService.approveCompany(companyId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Công ty đã được duyệt thành công', data: company });
    } catch (err) {
      next(err);
    }
  }

  async rejectCompany(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const company = await adminService.rejectCompany(companyId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Hồ sơ công ty đã bị từ chối', data: company });
    } catch (err) {
      next(err);
    }
  }

  async requestDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { companyId } = req.params;
      const { reason } = req.body;
      const adminId = req.user?.id as string;
      const company = await adminService.requestDocuments(companyId, adminId, reason);
      res.status(200).json({ status: 'success', message: 'Đã gửi yêu cầu bổ sung giấy tờ', data: company });
    } catch (err) {
      next(err);
    }
  }

  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const skip = parseInt(req.query.skip as string) || 0;
      const result = await adminService.getAuditLogs(limit, skip);
      res.status(200).json({ status: 'success', data: result.logs, total: result.total });
    } catch (err) {
      next(err);
    }
  }
}

export default new AdminController();
