import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Company, Service, ServiceCategory, User, Vehicle, RescueRequest } from '../models';

const DEFAULT_PASSWORD = 'Password123!';
const SALT_ROUNDS = 10;

const companySeed = {
  email: 'company@cuuho247.test',
  company_name: 'Cuu Ho 247 Sài Gòn',
  phone: '0901234567',
  address: {
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 10',
    ward: 'Phường 12',
    detail: '123 Lê Hồng Phong',
  },
  location: {
    type: 'Point' as const,
    coordinates: [106.665, 10.771] as [number, number],
  },
  license_url: 'https://example.com/license/company-license.jpg',
  status: 'active' as const,
  is_verified: true,
  rating_avg: 4.8,
  rating_count: 124,
};

const customerSeed = {
  email: 'customer@cuuho247.test',
  full_name: 'Nguyễn Văn Test',
  phone: '0912345678',
};

const categorySeeds = [
  { name: 'Xe chết máy', slug: 'xe-chet-may' },
  { name: 'Hết xăng', slug: 'het-xang' },
  { name: 'Thủng lốp', slug: 'thung-lop' },
  { name: 'Tai nạn nhẹ', slug: 'tai-nan-nhe' },
];

const vehicleSeeds = [
  { plate_number: '51K-12345', vehicle_type: 'Xe kéo ô tô', status: 'available' as const },
  { plate_number: '51C-67890', vehicle_type: 'Xe tải cẩu', status: 'available' as const },
  { plate_number: '59A-11223', vehicle_type: 'Xe máy cứu hộ', status: 'available' as const },
  { plate_number: '60B-44556', vehicle_type: 'Xe bán tải', status: 'unavailable' as const },
];

const serviceSeeds = [
  {
    name: 'Xe chết máy',
    categorySlug: 'xe-chet-may',
    price: 150000,
    description: 'Hỗ trợ kích bình, kiểm tra nhanh và kéo xe đến điểm sửa chữa gần nhất.',
  },
  {
    name: 'Hết xăng',
    categorySlug: 'het-xang',
    price: 100000,
    description: 'Tiếp nhiên liệu tận nơi trong khu vực hỗ trợ.',
  },
  {
    name: 'Thủng lốp',
    categorySlug: 'thung-lop',
    price: 80000,
    description: 'Vá lốp lưu động, thay lốp dự phòng và kiểm tra áp suất.',
  },
  {
    name: 'Tai nạn nhẹ',
    categorySlug: 'tai-nan-nhe',
    price: 200000,
    description: 'Cứu hộ hiện trường, kéo xe và hỗ trợ an toàn ban đầu.',
  },
];

const rescueRequestSeed = {
  description: 'Xe chết máy trên đường Nguyễn Hữu Cảnh, cần cứu hộ nhanh.',
  location: {
    type: 'Point' as const,
    coordinates: [106.7235, 10.7785] as [number, number],
  },
  address: {
    province: 'TP. Hồ Chí Minh',
    district: 'Quận Bình Thạnh',
    ward: 'Phường 22',
    detail: 'Nguyễn Hữu Cảnh, gần cầu Thủ Thiêm',
  },
};

async function upsertOne<T>(model: any, filter: Record<string, unknown>, update: Record<string, unknown>): Promise<T> {
  return model.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}

async function main() {
  await connectDB();

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const company = await upsertOne<any>(
    Company,
    { email: companySeed.email },
    {
      ...companySeed,
      password_hash: hashedPassword,
    }
  );

  const customer = await upsertOne<any>(
    User,
    { email: customerSeed.email },
    {
      ...customerSeed,
      password_hash: hashedPassword,
      status: 'active',
      is_verified: true,
    }
  );

  const categories: Array<any> = [];
  for (const seed of categorySeeds) {
    const category = await upsertOne<any>(
      ServiceCategory,
      { slug: seed.slug },
      {
        name: seed.name,
        slug: seed.slug,
        is_active: true,
      }
    );
    categories.push(category);
  }

  const vehicles: Array<any> = [];
  for (const seed of vehicleSeeds) {
    const vehicle = await upsertOne<any>(
      Vehicle,
      { company_id: company._id, plate_number: seed.plate_number },
      {
        company_id: company._id,
        plate_number: seed.plate_number,
        vehicle_type: seed.vehicle_type,
        status: seed.status,
      }
    );
    vehicles.push(vehicle);
  }

  for (const seed of serviceSeeds) {
    const category = categories.find((item) => item.slug === seed.categorySlug);
    if (!category) continue;

    await upsertOne<any>(
      Service,
      { company_id: company._id, category_id: category._id },
      {
        company_id: company._id,
        category_id: category._id,
        name: seed.name,
        price: seed.price,
        description: seed.description,
        is_active: true,
      }
    );
  }

  const firstVehicle = vehicles[0];
  const firstCategoryIds = categories.slice(0, 2).map((item) => item._id);

  if (firstVehicle) {
    await upsertOne<any>(
      RescueRequest,
      {
        user_id: customer._id,
        'company.company_id': company._id,
        'vehicle.vehicle_id': firstVehicle._id,
        description: rescueRequestSeed.description,
      },
      {
        user_id: customer._id,
        company: {
          company_id: company._id,
          company_name: company.company_name,
        },
        vehicle: {
          vehicle_id: firstVehicle._id,
          plate_number: firstVehicle.plate_number,
        },
        description: rescueRequestSeed.description,
        location: rescueRequestSeed.location,
        address: rescueRequestSeed.address,
        service_types: firstCategoryIds,
        status: 'pending',
        response_deadline: new Date(Date.now() + 30 * 60 * 1000),
        eta_minutes: 20,
        status_history: [
          {
            status: 'pending',
            changed_by: 'user',
            note: 'Seed data created',
            changed_at: new Date(),
          },
        ],
      }
    );
  }

  console.log('Seed completed successfully');
  console.log(`Company login: ${companySeed.email} / ${DEFAULT_PASSWORD}`);
  console.log(`Customer login: ${customerSeed.email} / ${DEFAULT_PASSWORD}`);
  console.log(`Seeded company: ${company.company_name}`);
  console.log(`Seeded vehicles: ${vehicleSeeds.length}`);
  console.log(`Seeded services: ${serviceSeeds.length}`);

  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
