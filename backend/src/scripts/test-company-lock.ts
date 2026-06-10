import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { Company } from '../shared/models/Company.model';
import { AdminLog } from '../shared/models/AdminLog.model';
import authService from '../modules/auth/auth.service';
import adminService from '../modules/admin/admin.service';
import { authenticate } from '../shared/middleware/auth.middleware';

const TEST_EMAIL = 'test-lock-company@cuuho247.vn';
const TEST_PASSWORD = 'TestPassword123!';
const TEST_COMPANY_NAME = 'Test Lock Company LLC';
const TEST_PHONE = '0988666555';

async function runTest() {
  console.log('Connecting to database...');
  await connectDB();

  // Clean up existing test company if any
  await Company.deleteOne({ email: TEST_EMAIL });

  console.log('\n--- 1. Testing Company Registration ---');
  const companyProfile = await authService.registerCompany({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    company_name: TEST_COMPANY_NAME,
    director_name: 'Director Test',
    phone: TEST_PHONE,
    address: '123 Test St',
    latitude: 10.771,
    longitude: 106.665,
    service_area: 'Các quận trung tâm TP.HCM',
  });

  console.log('Company registered successfully:', companyProfile.email);

  // Activate company (since default register status is pending_verification)
  const dbCompany = await Company.findOne({ email: TEST_EMAIL });
  if (!dbCompany) {
    throw new Error('Company was not saved to database!');
  }
  dbCompany.status = 'active';
  await dbCompany.save();

  console.log('Checking database model properties:');
  console.log(' - status:', dbCompany.status); // should be 'active'
  console.log('=> SUCCESS: Company created and activated.');

  console.log('\n--- 2. Testing Login for Active Company ---');
  const activeLogin = await authService.login({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  console.log('Login successful for active company. Token generated:', !!activeLogin.access_token);
  console.log('=> SUCCESS: Active company can login.');

  console.log('\n--- 3. Testing Lock Company via AdminService ---');
  const mockAdminId = new mongoose.Types.ObjectId().toString();
  const lockReason = 'Khóa công ty do nhiều phản ánh thái độ phục vụ kém';

  await adminService.lockCompany(dbCompany._id.toString(), mockAdminId, lockReason);

  const lockedCompany = await Company.findById(dbCompany._id);
  if (!lockedCompany || lockedCompany.status !== 'locked') {
    throw new Error(`Company status should be locked, got ${lockedCompany?.status}`);
  }
  console.log('Company status after locking:', lockedCompany.status);
  console.log('Company lock reason saved:', lockedCompany.lock_reason);

  // Check audit log
  const lockLogs = await AdminLog.find({
    target_type: 'company',
    target_id: dbCompany._id,
    action: 'lock_company',
  });
  if (lockLogs.length === 0) {
    throw new Error('No audit log recorded for locking the company!');
  }
  console.log('Audit log created:');
  console.log(' - action:', lockLogs[0].action);
  console.log(' - reason:', lockLogs[0].reason);
  console.log(' - admin_id:', lockLogs[0].admin_id);
  console.log('=> SUCCESS: Company account locked and log written.');

  console.log('\n--- 4. Testing Login for Locked Company ---');
  try {
    await authService.login({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    throw new Error('Login succeeded for locked company! This is an error.');
  } catch (err: any) {
    console.log('Login failed as expected:', err.message);
    if (err.statusCode !== 403 || !err.message.includes('Tài khoản công ty đã bị khóa. Lý do:')) {
      throw new Error(`Expected status 403 and specific message, got: ${err.statusCode} - ${err.message}`);
    }
  }
  console.log('=> SUCCESS: Locked company login is blocked with specific reason.');

  console.log('\n--- 4b. Testing Authenticate Middleware for Locked Company ---');
  let statusResponse: any = null;
  let jsonResponse: any = null;

  const mockReq: any = {
    header: (name: string) => {
      if (name === 'Authorization') return `Bearer ${activeLogin.access_token}`;
      return null;
    },
  };

  const mockRes: any = {
    status: (code: number) => {
      statusResponse = code;
      return {
        json: (data: any) => {
          jsonResponse = data;
        },
      };
    },
  };

  const mockNext = () => {
    throw new Error('next() was called but company is locked!');
  };

  await authenticate(mockReq, mockRes, mockNext);

  console.log('Middleware response code:', statusResponse);
  console.log('Middleware response json:', jsonResponse);
  if (statusResponse !== 403 || !jsonResponse?.message?.includes('Tài khoản công ty của bạn đã bị khóa. Lý do:')) {
    throw new Error('Authenticate middleware did not block the locked company properly!');
  }
  console.log('=> SUCCESS: Authenticate middleware blocks locked company requests.');

  console.log('\n--- 5. Testing Unlock Company via AdminService ---');
  const unlockReason = 'Mở khóa sau khi cam kết chấn chỉnh dịch vụ';
  await adminService.unlockCompany(dbCompany._id.toString(), mockAdminId, unlockReason);

  const unlockedCompany = await Company.findById(dbCompany._id);
  if (!unlockedCompany || unlockedCompany.status !== 'active') {
    throw new Error(`Company status should be active, got ${unlockedCompany?.status}`);
  }
  console.log('Company status after unlocking:', unlockedCompany.status);
  console.log(
    'Company lock reason cleared:',
    unlockedCompany.lock_reason === undefined || unlockedCompany.lock_reason === null
  );

  // Check audit log
  const unlockLogs = await AdminLog.find({
    target_type: 'company',
    target_id: dbCompany._id,
    action: 'unlock_company',
  });
  if (unlockLogs.length === 0) {
    throw new Error('No audit log recorded for unlocking the company!');
  }
  console.log('Audit log created:');
  console.log(' - action:', unlockLogs[0].action);
  console.log(' - reason:', unlockLogs[0].reason);

  // Fetch company logs list
  const companyLogs = await adminService.getCompanyLogs(dbCompany._id.toString());
  console.log(`Fetched ${companyLogs.length} logs for company. First log action:`, companyLogs[0]?.action);
  if (companyLogs.length < 2) {
    throw new Error('Expected at least 2 logs (lock and unlock)');
  }
  console.log('=> SUCCESS: Company unlocked and audit logs fetched successfully.');

  console.log('\n--- 6. Testing Login for Unlocked Company ---');
  const unlockedLogin = await authService.login({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  console.log('Login successful for unlocked company. Token generated:', !!unlockedLogin.access_token);
  console.log('=> SUCCESS: Unlocked company can login again.');

  // Clean up
  await Company.deleteOne({ _id: dbCompany._id });
  await AdminLog.deleteMany({ target_id: dbCompany._id });
  console.log('\nCleanup completed.');
  console.log('All tests passed successfully! ✅');
}

runTest()
  .then(() => {
    mongoose.disconnect();
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed with error:', error);
    mongoose.disconnect();
    process.exit(1);
  });
