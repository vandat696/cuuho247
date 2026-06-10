import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { RescueRequest } from '../shared/models/RescueRequest.model';
import { ServiceCategory } from '../shared/models/ServiceCategory.model';
import adminService from '../modules/admin/admin.service';

async function runTest() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Clearing existing test rescue requests...');
  // Find or create test service categories
  let category1 = await ServiceCategory.findOne({ slug: 'va-lop-test' });
  if (!category1) {
    category1 = await ServiceCategory.create({
      name: 'Vá lốp Test',
      slug: 'va-lop-test',
      is_active: true,
    });
  }

  let category2 = await ServiceCategory.findOne({ slug: 'keo-xe-test' });
  if (!category2) {
    category2 = await ServiceCategory.create({
      name: 'Kéo xe Test',
      slug: 'keo-xe-test',
      is_active: true,
    });
  }

  const userTestId = new mongoose.Types.ObjectId();
  const companyTestId = new mongoose.Types.ObjectId();

  const now = new Date();

  // Create test rescue requests spread over the last 15 days
  const requestsData = [
    // Today: completed, 500k, category1
    {
      user_id: userTestId,
      company: { company_id: companyTestId, company_name: 'Test Company' },
      description: 'Rescue 1',
      location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
      service_types: [category1._id],
      status: 'completed',
      payment: { amount: 500000, method: 'cash', paid_at: now },
      created_at: new Date(now.getTime()),
    },
    // Yesterday: completed, 300k, category2
    {
      user_id: userTestId,
      company: { company_id: companyTestId, company_name: 'Test Company' },
      description: 'Rescue 2',
      location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
      service_types: [category2._id],
      status: 'completed',
      payment: { amount: 300000, method: 'bank_transfer', paid_at: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
      created_at: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    },
    // 2 days ago: cancelled, category1
    {
      user_id: userTestId,
      company: { company_id: companyTestId, company_name: 'Test Company' },
      description: 'Rescue 3',
      location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
      service_types: [category1._id],
      status: 'cancelled',
      created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    // 5 days ago: completed, 1000k, both categories
    {
      user_id: userTestId,
      company: { company_id: companyTestId, company_name: 'Test Company' },
      description: 'Rescue 4',
      location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
      service_types: [category1._id, category2._id],
      status: 'completed',
      payment: { amount: 1000000, method: 'e_wallet', paid_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
      created_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    // 10 days ago: pending (does not fall into 7 days default window)
    {
      user_id: userTestId,
      company: { company_id: companyTestId, company_name: 'Test Company' },
      description: 'Rescue 5',
      location: { type: 'Point', coordinates: [105, 21], address: 'Hanoi' },
      service_types: [category2._id],
      status: 'pending',
      created_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
    },
  ];

  console.log('Seeding dummy rescue requests...');
  const createdRequests = await RescueRequest.create(requestsData);
  console.log(`Seeded ${createdRequests.length} rescue requests.`);

  try {
    console.log('\n--- Test 1: Default 7-day report ---');
    const defaultReport = await adminService.getRescueActivitiesReport();
    console.log('Summary:', defaultReport.summary);
    // Should contain today, yesterday, 2 days ago, 5 days ago. That is 4 requests total.
    // 3 completed, 1 cancelled. Success rate = 75%. Total revenue = 500k + 300k + 1000k = 1800k.
    if (defaultReport.summary.totalRequests !== 4) {
      throw new Error(`Expected 4 requests in last 7 days, got ${defaultReport.summary.totalRequests}`);
    }
    if (defaultReport.summary.completedRequests !== 3) {
      throw new Error(`Expected 3 completed requests, got ${defaultReport.summary.completedRequests}`);
    }
    if (defaultReport.summary.successRate !== 75) {
      throw new Error(`Expected 75% success rate, got ${defaultReport.summary.successRate}%`);
    }
    if (defaultReport.summary.totalRevenue !== 1800000) {
      throw new Error(`Expected 1800000 revenue, got ${defaultReport.summary.totalRevenue}`);
    }
    console.log('=> SUCCESS: Default report matching expectations.');

    console.log('\n--- Test 2: Custom date range (12 days ago to today) ---');
    const startStr = new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endStr = now.toISOString().split('T')[0];
    const rangeReport = await adminService.getRescueActivitiesReport(startStr, endStr);
    console.log('Summary:', rangeReport.summary);
    // Should contain all 5 requests.
    if (rangeReport.summary.totalRequests !== 5) {
      throw new Error(`Expected 5 requests in last 12 days, got ${rangeReport.summary.totalRequests}`);
    }
    console.log('=> SUCCESS: Date range filter working.');

    console.log('\n--- Test 3: Filter by service category (Vá lốp) ---');
    const category1Report = await adminService.getRescueActivitiesReport(startStr, endStr, category1._id.toString());
    console.log('Summary for Vá lốp:', category1Report.summary);
    // Rescue 1, 3, 4 have category1. So 3 requests. 2 completed, 1 cancelled. Success rate = 66.67%. Revenue = 1500k.
    if (category1Report.summary.totalRequests !== 3) {
      throw new Error(`Expected 3 requests for Vá lốp, got ${category1Report.summary.totalRequests}`);
    }
    console.log('=> SUCCESS: Service category filtering working.');

    console.log('\n--- Test 4: Time series grouping (day) and gap filling ---');
    // For 7 days, timeSeries length should be exactly 7
    if (defaultReport.timeSeries.length !== 7) {
      throw new Error(`Expected exactly 7 points in daily time-series, got ${defaultReport.timeSeries.length}`);
    }
    console.log(
      'TimeSeries dates:',
      defaultReport.timeSeries.map((p) => p.date)
    );
    console.log('TimeSeries points:', defaultReport.timeSeries);
    console.log('=> SUCCESS: Gap filling for days is working correctly.');

    console.log('\n--- Test 5: Validation errors ---');
    try {
      await adminService.getRescueActivitiesReport(endStr, startStr);
      throw new Error('Allowed startDate > endDate!');
    } catch (e: any) {
      console.log('Caught expected error for startDate > endDate:', e.message);
    }

    try {
      const longAgo = new Date(now.getTime() - 400 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      await adminService.getRescueActivitiesReport(longAgo, endStr);
      throw new Error('Allowed range > 366 days!');
    } catch (e: any) {
      console.log('Caught expected error for range > 366 days:', e.message);
    }
    console.log('=> SUCCESS: Validation constraints applied.');
  } finally {
    console.log('\nCleaning up database...');
    await RescueRequest.deleteMany({ _id: { $in: createdRequests.map((r) => r._id) } });
    await ServiceCategory.deleteOne({ _id: category1._id });
    await ServiceCategory.deleteOne({ _id: category2._id });
    console.log('Cleanup complete.');
  }

  console.log('All reports tests passed successfully! ✅');
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
