import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { RescueRequest } from '../shared/models/RescueRequest.model';
import { Review } from '../shared/models/Review.model';
import { Company } from '../shared/models/Company.model';
import adminService from '../modules/admin/admin.service';

async function runTest() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Clearing existing rescue requests and reviews...');
  await RescueRequest.deleteMany({});
  await Review.deleteMany({});

  console.log('Setting up test companies...');
  // Find or create test companies
  let company1 = await Company.findOne({ email: 'company-quality-1@test.vn' });
  if (!company1) {
    company1 = await Company.create({
      company_name: 'Quality Company A',
      email: 'company-quality-1@test.vn',
      phone: '0911111222',
      status: 'active',
      is_verified: true,
      director_name: 'Director A',
      address: {
        province: 'TP. Hà Nội',
        district: 'Quận Cầu Giấy',
        ward: 'Phường Dịch Vọng',
        detail: '1 Cầu Giấy',
      },
      service_area: 'Hà Nội',
      location: {
        type: 'Point',
        coordinates: [105.79, 21.03],
      },
      password_hash: 'mock_hash_value',
    });
  }

  let company2 = await Company.findOne({ email: 'company-quality-2@test.vn' });
  if (!company2) {
    company2 = await Company.create({
      company_name: 'Quality Company B',
      email: 'company-quality-2@test.vn',
      phone: '0911111333',
      status: 'active',
      is_verified: true,
      director_name: 'Director B',
      address: {
        province: 'TP. Hà Nội',
        district: 'Quận Cầu Giấy',
        ward: 'Phường Dịch Vọng',
        detail: '2 Cầu Giấy',
      },
      service_area: 'Hà Nội',
      location: {
        type: 'Point',
        coordinates: [105.79, 21.03],
      },
      password_hash: 'mock_hash_value',
    });
  }

  const userTestId = new mongoose.Types.ObjectId();
  const now = new Date();

  console.log('Setting up dummy rescue requests and reviews...');

  // Requests for Company A:
  // - 1 completed: created 10m ago, accepted 5m ago (duration 5m)
  // - 1 rejected (responded): created 20m ago, accepted_at = null
  // - 1 pending (unresponded): created today
  // Total = 3 requests, responded = 2, pending = 1. Response rate = 66.67%. Avg response time = 5m.
  const reqA1 = new RescueRequest({
    user_id: userTestId,
    company: { company_id: company1._id, company_name: company1.company_name },
    description: 'Req A1',
    location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
    status: 'completed',
    accepted_at: new Date(now.getTime() - 5 * 60000),
    created_at: new Date(now.getTime() - 10 * 60000),
  });

  const reqA2 = new RescueRequest({
    user_id: userTestId,
    company: { company_id: company1._id, company_name: company1.company_name },
    description: 'Req A2',
    location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
    status: 'rejected',
    created_at: new Date(now.getTime() - 20 * 60000),
  });

  const reqA3 = new RescueRequest({
    user_id: userTestId,
    company: { company_id: company1._id, company_name: company1.company_name },
    description: 'Req A3',
    location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
    status: 'pending',
    created_at: new Date(now.getTime() - 1 * 60000),
  });

  // Requests for Company B:
  // - 1 completed: created 15m ago, accepted 5m ago (duration 10m)
  // - 1 timeout (unresponded)
  // Total = 2 requests, responded = 1, timeout = 1. Response rate = 50%. Avg response time = 10m.
  const reqB1 = new RescueRequest({
    user_id: userTestId,
    company: { company_id: company2._id, company_name: company2.company_name },
    description: 'Req B1',
    location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
    status: 'completed',
    accepted_at: new Date(now.getTime() - 5 * 60000),
    created_at: new Date(now.getTime() - 15 * 60000),
  });

  const reqB2 = new RescueRequest({
    user_id: userTestId,
    company: { company_id: company2._id, company_name: company2.company_name },
    description: 'Req B2',
    location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
    status: 'timeout',
    created_at: new Date(now.getTime() - 30 * 60000),
  });

  const requests = await RescueRequest.create([reqA1, reqA2, reqA3, reqB1, reqB2]);

  // Reviews:
  // - Company A: 1 review rating 5
  // - Company B: 1 review rating 3
  const revA = new Review({
    rescue_request_id: reqA1._id,
    user_id: userTestId,
    company_id: company1._id,
    rating: 5,
    detailed_ratings: { response_time: 5, service_quality: 5, staff_attitude: 4, pricing: 5 },
    content: 'Very good!',
    is_visible: true,
    created_at: now,
  });

  const revB = new Review({
    rescue_request_id: reqB1._id,
    user_id: userTestId,
    company_id: company2._id,
    rating: 3,
    detailed_ratings: { response_time: 3, service_quality: 3, staff_attitude: 3, pricing: 2 },
    content: 'Normal',
    is_visible: true,
    created_at: now,
  });

  const reviews = await Review.create([revA, revB]);

  try {
    console.log('\n--- Test 1: Active Companies List Dropdown ---');
    const allCompaniesList = await adminService.getAllCompanies();
    console.log('Active companies fetched:', allCompaniesList.length);
    const emails = allCompaniesList.map((c) => c.company_name);
    if (!emails.includes(company1.company_name) || !emails.includes(company2.company_name)) {
      throw new Error('Active companies list is missing test companies');
    }
    console.log('=> SUCCESS: Companies list fetched correctly.');

    console.log('\n--- Test 2: System-wide report (All Companies) ---');
    const systemReport = await adminService.getServiceQualityReport();
    console.log('Summary:', systemReport.summary);
    // Total requests = 5, responded = 3 (A1, A2, B1). Rate = 3/5 = 60%.
    // Accepted requests = 2 (A1, B1), durations 5m + 10m = 15m. Avg = 7.5m.
    // Total reviews = 2. Avg rating = (5 + 3)/2 = 4.0.
    if (systemReport.summary.totalRequests !== 5) {
      throw new Error(`Expected 5 total requests, got ${systemReport.summary.totalRequests}`);
    }
    if (systemReport.summary.responseRate !== 60) {
      throw new Error(`Expected 60% response rate, got ${systemReport.summary.responseRate}%`);
    }
    if (systemReport.summary.avgResponseTime !== 7.5) {
      throw new Error(`Expected 7.5 min response time, got ${systemReport.summary.avgResponseTime}`);
    }
    if (systemReport.summary.avgRating !== 4.0) {
      throw new Error(`Expected 4.0 avg rating, got ${systemReport.summary.avgRating}`);
    }

    console.log('\nChecking Company Breakdown:');
    console.log(systemReport.companyBreakdown);
    // Company A should be ranked first because rating is 5.0 (A) vs 3.0 (B)
    const breakdownA = systemReport.companyBreakdown.find((b: any) => b.companyId === company1._id.toString());
    const breakdownB = systemReport.companyBreakdown.find((b: any) => b.companyId === company2._id.toString());
    if (!breakdownA || breakdownA.responseRate !== 66.67 || breakdownA.avgRating !== 5.0) {
      throw new Error(`Invalid breakdown for Company A: ${JSON.stringify(breakdownA)}`);
    }
    if (!breakdownB || breakdownB.responseRate !== 50 || breakdownB.avgRating !== 3.0) {
      throw new Error(`Invalid breakdown for Company B: ${JSON.stringify(breakdownB)}`);
    }
    console.log('=> SUCCESS: System quality statistics match mathematical models.');

    console.log('\n--- Test 3: Specific Company A Report ---');
    const compAReport = await adminService.getServiceQualityReport(undefined, undefined, company1._id.toString());
    console.log('Company A Summary:', compAReport.summary);
    if (compAReport.summary.totalRequests !== 3) {
      throw new Error(`Expected 3 requests for Company A, got ${compAReport.summary.totalRequests}`);
    }
    if (compAReport.summary.responseRate !== 66.67) {
      throw new Error(`Expected 66.67% response rate, got ${compAReport.summary.responseRate}%`);
    }
    if (compAReport.summary.avgResponseTime !== 5.0) {
      throw new Error(`Expected 5.0 min response time, got ${compAReport.summary.avgResponseTime}`);
    }
    if (compAReport.summary.avgRating !== 5.0) {
      throw new Error(`Expected 5.0 avg rating, got ${compAReport.summary.avgRating}`);
    }
    console.log('Detailed Ratings Avg:', compAReport.summary.detailedRatingsAvg);
    if (
      compAReport.summary.detailedRatingsAvg?.response_time !== 5.0 ||
      compAReport.summary.detailedRatingsAvg?.staff_attitude !== 4.0
    ) {
      throw new Error('Detailed ratings not calculated correctly');
    }
    console.log('=> SUCCESS: Specific company detail report matches calculations.');
  } finally {
    console.log('\nCleaning up database...');
    await RescueRequest.deleteMany({ _id: { $in: requests.map((r) => r._id) } });
    await Review.deleteMany({ _id: { $in: reviews.map((r) => r._id) } });
    await Company.deleteOne({ _id: company1._id });
    await Company.deleteOne({ _id: company2._id });
    console.log('Cleanup completed.');
  }

  console.log('All quality report tests passed successfully! ✅');
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
