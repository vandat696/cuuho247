import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { RescueRequest } from '../shared/models/RescueRequest.model';
import { Review } from '../shared/models/Review.model';
import { Company } from '../shared/models/Company.model';
import { User } from '../shared/models/User.model';
import { ServiceCategory } from '../shared/models/ServiceCategory.model';
import { Service } from '../shared/models/Service.model';
import { Vehicle } from '../shared/models/Vehicle.model';

const REVIEW_CONTENTS = [
  'Dịch vụ rất tốt, nhân viên thân thiện và chuyên nghiệp!',
  'Cứu hộ nhanh chóng, giá cả hợp lý.',
  'Nhân viên hỗ trợ nhiệt tình, khắc phục sự cố rất nhanh.',
  'Xe đến hơi muộn một chút nhưng hỗ trợ rất chu đáo.',
  'Chất lượng dịch vụ tạm ổn, giá hơi cao.',
  'Dịch vụ cứu hộ nhanh gọn lẹ, cảm ơn đội ngũ kỹ thuật.',
  'Thái độ phục vụ tốt, sẽ tiếp tục ủng hộ khi gặp sự cố.',
  'Làm việc chuyên nghiệp, trang thiết bị hiện đại.',
  'Hơi chậm trễ trong khâu tiếp cận nhưng sửa chữa tốt.',
];

async function seedData() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Cleaning up existing rescue requests and reviews...');
  await RescueRequest.deleteMany({});
  await Review.deleteMany({});
  console.log('Existing requests and reviews cleared.');

  // 1. Setup Service Categories
  console.log('Setting up service categories...');
  const categoriesData = [
    { name: 'Vá vỏ / Vá lốp xe', slug: 'va-vo-va-lop-xe', is_active: true },
    { name: 'Cẩu kéo xe ô tô', slug: 'cau-keo-xe-o-to', is_active: true },
    { name: 'Kích bình / Sạc ắc quy', slug: 'kich-binh-sac-ac-quy', is_active: true },
    { name: 'Sửa chữa động cơ lưu động', slug: 'sua-chua-dong-co-luu-dong', is_active: true },
    { name: 'Tiếp nhiên liệu', slug: 'tiep-nhien-lieu', is_active: true },
    { name: 'Cứu hộ khóa xe', slug: 'cuu-ho-khoa-xe', is_active: true },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    let category = await ServiceCategory.findOne({ slug: cat.slug });
    if (!category) {
      category = await ServiceCategory.create(cat);
      console.log(`Created service category: ${cat.name}`);
    }
    categories.push(category);
  }

  // 2. Setup Test Companies
  console.log('Setting up test companies...');
  const companiesData = [
    {
      company_name: 'Cứu hộ Hà Nội 247',
      email: 'cuuhohanoi247@test.vn',
      phone: '0912222333',
      status: 'active' as const,
      is_verified: true,
      director_name: 'Trần Văn Kiên',
      address: { province: 'TP. Hà Nội', district: 'Quận Cầu Giấy', ward: 'Phường Dịch Vọng', detail: '12 Cầu Giấy' },
      service_area: 'Hà Nội',
      location: { type: 'Point', coordinates: [105.79, 21.03] },
      password_hash: 'mock_password_hash',
    },
    {
      company_name: 'Cứu hộ Đông Đô',
      email: 'cuuohodongdo@test.vn',
      phone: '0913333444',
      status: 'active' as const,
      is_verified: true,
      director_name: 'Nguyễn Tiến Dũng',
      address: {
        province: 'TP. Hà Nội',
        district: 'Quận Hai Bà Trưng',
        ward: 'Phường Bách Khoa',
        detail: '45 Đại Cồ Việt',
      },
      service_area: 'Hà Nội',
      location: { type: 'Point', coordinates: [105.85, 21.01] },
      password_hash: 'mock_password_hash',
    },
    {
      company_name: 'Cứu hộ Sài Gòn',
      email: 'cuuhosaigon@test.vn',
      phone: '0914444555',
      status: 'active' as const,
      is_verified: true,
      director_name: 'Lê Hoàng Nam',
      address: { province: 'TP. Hồ Chí Minh', district: 'Quận 1', ward: 'Phường Bến Nghé', detail: '88 Lê Lợi' },
      service_area: 'TP. Hồ Chí Minh',
      location: { type: 'Point', coordinates: [106.7, 10.77] },
      password_hash: 'mock_password_hash',
    },
  ];

  const companies = [];
  for (const comp of companiesData) {
    let company = await Company.findOne({ email: comp.email });
    if (!company) {
      company = await Company.create(comp);
      console.log(`Created company: ${comp.company_name}`);
    } else {
      // Keep it active for reports
      company.status = 'active';
      company.is_verified = true;
      company.location = comp.location as any;
      company.address = comp.address;
      await company.save();
    }
    companies.push(company);
  }

  // 2b. Setup Services for Test Companies
  console.log('Setting up services for test companies...');
  const companyIds = companies.map((c) => c._id);
  await Service.deleteMany({ company_id: { $in: companyIds } });

  const servicesData = [
    // Hà Nội 247
    {
      companyEmail: 'cuuhohanoi247@test.vn',
      categorySlug: 'va-vo-va-lop-xe',
      name: 'Vá vỏ / Vá lốp xe',
      price: 70000,
      description: 'Vá lốp lưu động nhanh chóng.',
    },
    {
      companyEmail: 'cuuhohanoi247@test.vn',
      categorySlug: 'kich-binh-sac-ac-quy',
      name: 'Kích bình / Sạc ắc quy',
      price: 110000,
      description: 'Kích bình ắc quy lưu động.',
    },
    {
      companyEmail: 'cuuhohanoi247@test.vn',
      categorySlug: 'sua-chua-dong-co-luu-dong',
      name: 'Sửa chữa động cơ lưu động',
      price: 140000,
      description: 'Sửa chữa hỏng hóc động cơ tại chỗ.',
    },
    {
      companyEmail: 'cuuhohanoi247@test.vn',
      categorySlug: 'tiep-nhien-lieu',
      name: 'Tiếp nhiên liệu',
      price: 90000,
      description: 'Tiếp xăng dầu khẩn cấp.',
    },
    // Đông Đô
    {
      companyEmail: 'cuuohodongdo@test.vn',
      categorySlug: 'va-vo-va-lop-xe',
      name: 'Vá vỏ / Vá lốp xe',
      price: 80000,
      description: 'Vá vỏ xe ô tô và xe máy.',
    },
    {
      companyEmail: 'cuuohodongdo@test.vn',
      categorySlug: 'cau-keo-xe-o-to',
      name: 'Cẩu kéo xe ô tô',
      price: 220000,
      description: 'Cứu hộ cẩu kéo xe ô tô.',
    },
    {
      companyEmail: 'cuuohodongdo@test.vn',
      categorySlug: 'sua-chua-dong-co-luu-dong',
      name: 'Sửa chữa động cơ lưu động',
      price: 160000,
      description: 'Kiểm tra và sửa lỗi động cơ.',
    },
    // Sài Gòn
    {
      companyEmail: 'cuuhosaigon@test.vn',
      categorySlug: 'va-vo-va-lop-xe',
      name: 'Vá vỏ / Vá lốp xe',
      price: 75000,
      description: 'Vá vỏ xe hơi, xe máy tận nơi.',
    },
    {
      companyEmail: 'cuuhosaigon@test.vn',
      categorySlug: 'kich-binh-sac-ac-quy',
      name: 'Kích bình / Sạc ắc quy',
      price: 120000,
      description: 'Sạc bình kích nổ ắc quy.',
    },
    {
      companyEmail: 'cuuhosaigon@test.vn',
      categorySlug: 'cau-keo-xe-o-to',
      name: 'Cẩu kéo xe ô tô',
      price: 250000,
      description: 'Xe cứu hộ chuyên dụng kéo chở xe.',
    },
    {
      companyEmail: 'cuuhosaigon@test.vn',
      categorySlug: 'cuu-ho-khoa-xe',
      name: 'Cứu hộ khóa xe',
      price: 150000,
      description: 'Hỗ trợ mở khóa cửa xe ô tô.',
    },
  ];

  for (const s of servicesData) {
    const comp = companies.find((c) => c.email === s.companyEmail);
    const cat = categories.find((c) => c.slug === s.categorySlug);
    if (comp && cat) {
      await Service.create({
        company_id: comp._id,
        category_id: cat._id,
        name: s.name,
        price: s.price,
        description: s.description,
        is_active: true,
      });
    }
  }
  console.log('Seeded services for test companies.');

  // 2c. Setup Vehicles for Test Companies
  console.log('Setting up vehicles for test companies...');
  await Vehicle.deleteMany({ company_id: { $in: companyIds } });
  for (const comp of companies) {
    await Vehicle.create({
      company_id: comp._id,
      plate_number:
        comp.company_name === 'Cứu hộ Hà Nội 247'
          ? '30A-99999'
          : comp.company_name === 'Cứu hộ Đông Đô'
            ? '30E-88888'
            : '51K-77777',
      vehicle_type: 'Xe cứu hộ đa năng',
      status: 'available',
    });
  }
  console.log('Seeded vehicles for test companies.');

  // 3. Setup Test User (Customer)
  console.log('Setting up test user...');
  let user = await User.findOne({ email: 'nguyenvana@test.vn' });
  if (!user) {
    user = await User.create({
      full_name: 'Nguyễn Văn A',
      email: 'nguyenvana@test.vn',
      phone: '0988888777',
      password_hash: 'mock_password_hash',
      status: 'active',
    });
    console.log(`Created user: ${user.full_name}`);
  }

  // 4. Generate Rescue Requests & Reviews over past 30 days
  console.log('Generating dummy rescue requests and reviews...');
  const now = new Date();
  const requestsToCreate = [];
  const reviewsToCreate = [];

  // Generate a random number of requests for each of the last 30 days
  for (let dayAgo = 30; dayAgo >= 0; dayAgo--) {
    const targetDate = new Date(now.getTime() - dayAgo * 24 * 60 * 60 * 1000);
    // Number of requests on this day: between 2 and 6
    const requestsCount = Math.floor(Math.random() * 5) + 2;

    for (let i = 0; i < requestsCount; i++) {
      // Pick random company
      const companyIndex = Math.floor(Math.random() * companies.length);
      const company = companies[companyIndex];

      // Pick random categories (1 to 2)
      const numCats = Math.floor(Math.random() * 2) + 1;
      const shuffledCats = [...categories].sort(() => 0.5 - Math.random());
      const selectedCats = shuffledCats.slice(0, numCats).map((c) => c._id);

      // Random hour, minute, second
      const reqDate = new Date(targetDate);
      reqDate.setHours(Math.floor(Math.random() * 24));
      reqDate.setMinutes(Math.floor(Math.random() * 60));
      reqDate.setSeconds(Math.floor(Math.random() * 60));

      // Status distribution: 75% completed, 10% cancelled, 10% rejected, 5% pending/timeout
      const rand = Math.random();
      let status: 'completed' | 'cancelled' | 'rejected' | 'pending' | 'timeout' = 'completed';
      if (rand >= 0.75 && rand < 0.85) {
        status = 'cancelled';
      } else if (rand >= 0.85 && rand < 0.95) {
        status = 'rejected';
      } else if (rand >= 0.95) {
        status = Math.random() > 0.5 ? 'pending' : 'timeout';
      }

      // Timeline setup
      const created_at = reqDate;
      let accepted_at: Date | undefined;
      let completed_at: Date | undefined;
      let cancelled_at: Date | undefined;
      let payment: any = undefined;

      if (status === 'completed') {
        const acceptDelay = Math.floor(Math.random() * 8) + 1; // 1 to 9 mins response
        accepted_at = new Date(created_at.getTime() + acceptDelay * 60 * 1000);

        const completionDelay = Math.floor(Math.random() * 30) + 15; // 15 to 45 mins active service
        completed_at = new Date(accepted_at.getTime() + completionDelay * 60 * 1000);

        // Payment details
        const paymentAmount = (Math.floor(Math.random() * 15) + 3) * 50000; // 150k to 900k VND
        payment = {
          amount: paymentAmount,
          method: ['cash', 'bank_transfer', 'e_wallet'][Math.floor(Math.random() * 3)],
          paid_at: completed_at,
        };
      } else if (status === 'cancelled') {
        const cancelDelay = Math.floor(Math.random() * 20) + 2;
        cancelled_at = new Date(created_at.getTime() + cancelDelay * 60 * 1000);
      }

      const reqId = new mongoose.Types.ObjectId();
      const newRequest = {
        _id: reqId,
        user_id: user._id,
        company: {
          company_id: company._id,
          company_name: company.company_name,
        },
        description: `Yêu cầu cứu hộ khẩn cấp ngày ${created_at.toLocaleDateString('vi-VN')}`,
        location: {
          type: 'Point',
          coordinates: [
            company.location.coordinates[0] + (Math.random() - 0.5) * 0.05,
            company.location.coordinates[1] + (Math.random() - 0.5) * 0.05,
          ],
        },
        service_types: selectedCats,
        address: {
          province: company.address.province,
          district: company.address.district,
          ward: company.address.ward,
          detail: 'Vị trí sự cố trên đường',
        },
        status,
        accepted_at,
        completed_at,
        cancelled_at,
        payment,
        created_at,
        updated_at: completed_at || cancelled_at || created_at,
      };

      requestsToCreate.push(newRequest);

      // Create reviews for completed requests with 70% probability
      if (status === 'completed' && Math.random() < 0.7) {
        // Design rating profiles to make dashboard comparisons distinct:
        // - Company A (Hà Nội 247): High rating (4.0 - 5.0)
        // - Company B (Đông Đô): Moderate rating (3.0 - 4.5)
        // - Company C (Sài Gòn): Mixed rating (2.0 - 4.5)
        let rating = 4;
        if (companyIndex === 0) {
          rating = Math.random() > 0.3 ? 5 : 4;
        } else if (companyIndex === 1) {
          rating = Math.random() > 0.5 ? 4 : Math.random() > 0.5 ? 5 : 3;
        } else {
          rating = Math.floor(Math.random() * 4) + 2; // 2, 3, 4, 5
        }

        const clamp = (val: number) => Math.max(1, Math.min(5, val));
        const detailed_ratings = {
          response_time: clamp(rating + (Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? 1 : -1)),
          service_quality: clamp(rating + (Math.random() > 0.6 ? 0 : Math.random() > 0.5 ? 1 : -1)),
          staff_attitude: rating,
          pricing: clamp(rating + (Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? -1 : 1)),
        };

        const review = {
          rescue_request_id: reqId,
          user_id: user._id,
          company_id: company._id,
          rating,
          detailed_ratings,
          content: REVIEW_CONTENTS[Math.floor(Math.random() * REVIEW_CONTENTS.length)],
          is_visible: true,
          created_at: completed_at,
          updated_at: completed_at,
        };

        reviewsToCreate.push(review);
      }
    }
  }

  console.log(`Inserting ${requestsToCreate.length} rescue requests...`);
  await RescueRequest.insertMany(requestsToCreate);

  console.log(`Inserting ${reviewsToCreate.length} reviews...`);
  await Review.insertMany(reviewsToCreate);

  // 5. Update Company overall ratings fields for completeness
  console.log('Calculating and updating company rating averages...');
  for (const comp of companies) {
    const companyReviews = reviewsToCreate.filter((r) => r.company_id.toString() === comp._id.toString());
    const count = companyReviews.length;
    const avg = count > 0 ? companyReviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    comp.rating_avg = Math.round(avg * 100) / 100;
    comp.rating_count = count;
    await comp.save();
    console.log(`Updated rating for ${comp.company_name}: ${comp.rating_avg}★ (${comp.rating_count} reviews)`);
  }

  console.log('\n=========================================');
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
  console.log(`- Service Categories: ${categories.length}`);
  console.log(`- Companies Active: ${companies.length}`);
  console.log(`- User Customer: 1`);
  console.log(`- Rescue Requests Created: ${requestsToCreate.length}`);
  console.log(`- Reviews Created: ${reviewsToCreate.length}`);
  console.log('=========================================');
}

seedData()
  .then(() => {
    mongoose.disconnect();
    console.log('Database connection closed.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed with error:', err);
    mongoose.disconnect();
    process.exit(1);
  });
