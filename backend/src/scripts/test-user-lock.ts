import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { User } from '../shared/models/User.model';
import { AdminLog } from '../shared/models/AdminLog.model';
import authService from '../modules/auth/auth.service';
import adminService from '../modules/admin/admin.service';
import { authenticate } from '../shared/middleware/auth.middleware';

const TEST_EMAIL = 'test-lock-user@cuuho247.vn';
const TEST_PASSWORD = 'TestPassword123!';
const TEST_NAME = 'Test Lock/Unlock User';
const TEST_PHONE = '0988777666';

async function runTest() {
  console.log('Connecting to database...');
  await connectDB();

  // Clean up existing test user if any
  await User.deleteOne({ email: TEST_EMAIL });

  console.log('\n--- 1. Testing Registration (without is_verified) ---');
  const userProfile = await authService.customerRegister({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
    full_name: TEST_NAME,
    phone: TEST_PHONE,
  });

  console.log('User registered successfully:', userProfile.email);

  // Check from database directly
  const dbUser = await User.findOne({ email: TEST_EMAIL });
  if (!dbUser) {
    throw new Error('User was not saved to database!');
  }

  console.log('Checking database model properties:');
  console.log(' - status:', dbUser.status); // should be 'active'
  console.log(' - is_verified exists:', 'is_verified' in dbUser.toObject()); // should be false
  if ('is_verified' in dbUser.toObject()) {
    throw new Error('is_verified property should not exist on the user!');
  }
  if (dbUser.status !== 'active') {
    throw new Error(`User should be active by default, got ${dbUser.status}`);
  }
  console.log('=> SUCCESS: User created with correct fields.');

  console.log('\n--- 2. Testing Login for Active User ---');
  const activeLogin = await authService.login({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  console.log('Login successful for active user. Token generated:', !!activeLogin.access_token);
  console.log('=> SUCCESS: Active user can login.');

  console.log('\n--- 3. Testing Lock Account via AdminService ---');
  const mockAdminId = new mongoose.Types.ObjectId().toString();
  const lockReason = 'Thử nghiệm khóa tài khoản do spam yêu cầu';

  await adminService.lockUser(dbUser._id.toString(), mockAdminId, lockReason);

  const lockedUser = await User.findById(dbUser._id);
  if (!lockedUser || lockedUser.status !== 'locked') {
    throw new Error(`User status should be locked, got ${lockedUser?.status}`);
  }
  console.log('User status after locking:', lockedUser.status);

  // Check audit log
  const lockLogs = await AdminLog.find({
    target_type: 'user',
    target_id: dbUser._id,
    action: 'lock_user',
  });
  if (lockLogs.length === 0) {
    throw new Error('No audit log recorded for locking the account!');
  }
  console.log('Audit log created:');
  console.log(' - action:', lockLogs[0].action);
  console.log(' - reason:', lockLogs[0].reason);
  console.log(' - admin_id:', lockLogs[0].admin_id);
  console.log('=> SUCCESS: User account status set to locked and log written.');

  console.log('\n--- 4. Testing Login for Locked User ---');
  try {
    await authService.login({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
    throw new Error('Login succeeded for locked user! This is an error.');
  } catch (err: any) {
    console.log('Login failed as expected:', err.message);
    if (err.statusCode !== 403 || !err.message.includes('Tài khoản của bạn đã bị khóa')) {
      throw new Error(`Expected status 403 and specific message, got: ${err.statusCode} - ${err.message}`);
    }
  }
  console.log('=> SUCCESS: Locked user is blocked from logging in.');

  console.log('\n--- 4b. Testing Authenticate Middleware for Locked User ---');
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
    throw new Error('next() was called but user is locked!');
  };

  await authenticate(mockReq, mockRes, mockNext);

  console.log('Middleware response code:', statusResponse);
  console.log('Middleware response json:', jsonResponse);
  if (statusResponse !== 403 || !jsonResponse?.message?.includes('Tài khoản của bạn đã bị khóa. Lý do:')) {
    throw new Error('Authenticate middleware did not block the locked user properly!');
  }
  console.log('=> SUCCESS: Authenticate middleware blocks locked user requests.');

  console.log('\n--- 5. Testing Unlock Account via AdminService ---');
  const unlockReason = 'Mở khóa sau khi xác minh thông tin';
  await adminService.unlockUser(dbUser._id.toString(), mockAdminId, unlockReason);

  const unlockedUser = await User.findById(dbUser._id);
  if (!unlockedUser || unlockedUser.status !== 'active') {
    throw new Error(`User status should be active, got ${unlockedUser?.status}`);
  }
  console.log('User status after unlocking:', unlockedUser.status);

  // Check audit log
  const unlockLogs = await AdminLog.find({
    target_type: 'user',
    target_id: dbUser._id,
    action: 'unlock_user',
  });
  if (unlockLogs.length === 0) {
    throw new Error('No audit log recorded for unlocking the account!');
  }
  console.log('Audit log created:');
  console.log(' - action:', unlockLogs[0].action);
  console.log(' - reason:', unlockLogs[0].reason);
  console.log(' - admin_id:', unlockLogs[0].admin_id);

  // Fetch user logs list
  const userLogs = await adminService.getUserLogs(dbUser._id.toString());
  console.log(`Fetched ${userLogs.length} logs for user. First log action:`, userLogs[0]?.action);
  if (userLogs.length < 2) {
    throw new Error('Expected at least 2 logs (lock and unlock)');
  }
  console.log('=> SUCCESS: User account unlocked and logs fetched successfully.');

  console.log('\n--- 6. Testing Login for Unlocked User ---');
  const unlockedLogin = await authService.login({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  console.log('Login successful for unlocked user. Token generated:', !!unlockedLogin.access_token);
  console.log('=> SUCCESS: Unlocked user can login again.');

  // Clean up
  await User.deleteOne({ _id: dbUser._id });
  await AdminLog.deleteMany({ target_id: dbUser._id });
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
