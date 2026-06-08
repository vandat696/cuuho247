import { ApiError } from '@/shared/utils/apiError.util';
import { Company } from '@/shared/models/Company.model';
import { AdminLog } from '@/shared/models/AdminLog.model';
import { Notification } from '@/shared/models/Notification.model';

class AdminService {
  async approveCompany(companyId: string, adminId: string, reason?: string) {
    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Công ty không tồn tại');
    if (company.status === 'active') throw new ApiError(400, 'Công ty đã được duyệt');

    company.status = 'active';
    company.is_verified = true;
    await company.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'verify_company',
      target_type: 'company',
      target_id: company._id,
      details: { reason },
    });

    await Notification.create({
      recipient_type: 'company',
      recipient_id: company._id,
      type: 'company_approved',
      title: 'Tài khoản đã được phê duyệt',
      body: reason ? `Lý do: ${reason}` : 'Hồ sơ công ty của bạn đã được quản trị viên phê duyệt thành công.',
    });

    return company;
  }

  async rejectCompany(companyId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Lý do từ chối là bắt buộc');

    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Công ty không tồn tại');

    company.status = 'rejected';
    company.is_verified = false;
    await company.save();

    await AdminLog.create({
      admin_id: adminId,
      action: 'reject_company',
      target_type: 'company',
      target_id: company._id,
      details: { reason },
    });

    await Notification.create({
      recipient_type: 'company',
      recipient_id: company._id,
      type: 'company_rejected',
      title: 'Hồ sơ xác minh bị từ chối',
      body: `Hồ sơ công ty của bạn đã bị từ chối. Lý do: ${reason}`,
    });

    return company;
  }

  async requestDocuments(companyId: string, adminId: string, reason: string) {
    if (!reason) throw new ApiError(400, 'Yêu cầu bổ sung là bắt buộc');

    const company = await Company.findById(companyId);
    if (!company) throw new ApiError(404, 'Công ty không tồn tại');

    // Keep status as pending_verification but notify the company
    await AdminLog.create({
      admin_id: adminId,
      action: 'request_more_docs',
      target_type: 'company',
      target_id: company._id,
      details: { reason },
    });

    await Notification.create({
      recipient_type: 'company',
      recipient_id: company._id,
      type: 'company_document_requested',
      title: 'Yêu cầu bổ sung giấy tờ',
      body: `Quản trị viên yêu cầu bổ sung thông tin/giấy tờ: ${reason}`,
    });

    return company;
  }

  async getAuditLogs(limit: number = 50, skip: number = 0) {
    const logs = await AdminLog.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .populate('admin_id', 'full_name email');
    const total = await AdminLog.countDocuments();
    return { logs, total };
  }

  async getPendingCompanies() {
    return await Company.find({ status: 'pending_verification' }).sort({ updated_at: -1 });
  }
}

export default new AdminService();
