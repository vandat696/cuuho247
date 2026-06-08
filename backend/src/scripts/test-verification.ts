import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { Company } from '../shared/models/Company.model';
import authService from '../modules/auth/auth.service';
import adminService from '../modules/admin/admin.service';
import companyService from '../modules/company/company.service';

async function runTests() {
  await connectDB();
  console.log('--- Bắt đầu test luồng xác minh công ty ---');

  try {
    // 1. Công ty login
    console.log('\n1. Công ty đăng nhập...');
    const loginResult = await authService.login({
      email: 'company@cuuho247.test',
      password: 'Password123!',
    });
    console.log('=> Login thành công, Role:', loginResult.role);

    const companyId = loginResult.user._id.toString();

    // 2. Admin login
    console.log('\n2. Admin đăng nhập...');
    const adminLogin = await authService.login({
      email: 'admin@cuuho247.test',
      password: 'Password123!',
    });
    console.log('=> Admin login thành công');
    const adminId = adminLogin.user._id.toString();

    // 3. Admin: Reject company first to test flow
    console.log('\n3. Admin từ chối công ty...');
    await adminService.rejectCompany(companyId, adminId, 'Giấy phép không rõ ràng');
    let company = await Company.findById(companyId);
    console.log('=> Trạng thái công ty sau khi từ chối:', company?.status); // 'rejected'

    // 4. Công ty: Update profile (chuyển sang pending_verification)
    console.log('\n4. Công ty cập nhật profile...');
    const updateInput = {
      company_name: 'Cuu Ho 247 Update',
      address: {
        province: 'TP. HCM',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        detail: 'Số 1 Lê Duẩn',
      },
    };
    const updated = await companyService.updateCompanyProfile(companyId, updateInput);
    console.log('=> Trạng thái công ty sau khi update:', updated.status); // 'pending_verification'

    // 5. Admin: Yêu cầu bổ sung giấy tờ
    console.log('\n5. Admin yêu cầu bổ sung giấy tờ...');
    await adminService.requestDocuments(companyId, adminId, 'Vui lòng cung cấp mặt sau CMND');
    company = await Company.findById(companyId);
    console.log('=> Trạng thái công ty (không đổi):', company?.status); // 'pending_verification'

    // 6. Admin: Duyệt công ty
    console.log('\n6. Admin phê duyệt công ty...');
    await adminService.approveCompany(companyId, adminId, 'Hồ sơ hợp lệ');
    company = await Company.findById(companyId);
    console.log('=> Trạng thái công ty sau khi duyệt:', company?.status); // 'active'
    console.log('=> Is Verified:', company?.is_verified); // true

    // 7. Admin: Xem logs
    console.log('\n7. Lịch sử Admin (Logs)...');
    const logsData = await adminService.getAuditLogs(3, 0);
    for (const log of logsData.logs) {
      console.log(`- Hành động: ${log.action}, Lý do: ${(log.details as any)?.reason}`);
    }

    console.log('\n--- Kiểm tra thành công! ---');
  } catch (error: any) {
    console.error('\n--- LỖI KHI TEST ---');
    console.error(error.message || error);
  } finally {
    await mongoose.disconnect();
  }
}

runTests();
