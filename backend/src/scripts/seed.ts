import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import { Company, Service, ServiceCategory, User, Vehicle, RescueRequest, Admin } from '../shared/models';

const DEFAULT_PASSWORD = 'Password123!';
const SALT_ROUNDS = 10;

const companySeed = {
  email: 'company@cuuho247.test',
  company_name: 'Cuu Ho 247 Sài Gòn',
  director_name: 'Nguyễn Văn Giám Đốc',
  phone: '0901234567',
  address: {
    province: 'TP. Hồ Chí Minh',
    district: 'Quận 10',
    ward: 'Phường 12',
    detail: '123 Lê Hồng Phong',
  },
  service_area: 'Các quận trung tâm TP.HCM',
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

const adminSeed = {
  email: 'admin@cuuho247.test',
  full_name: 'Hệ Thống Admin',
};

const categorySeeds = [
  { name: 'Vá vỏ / Vá lốp xe', slug: 'va-vo-va-lop-xe' },
  { name: 'Kích bình / Sạc ắc quy', slug: 'kich-binh-sac-ac-quy' },
  { name: 'Tiếp nhiên liệu', slug: 'tiep-nhien-lieu' },
  { name: 'Sửa chữa động cơ lưu động', slug: 'sua-chua-dong-co-luu-dong' },
  { name: 'Cẩu kéo xe ô tô', slug: 'cau-keo-xe-o-to' },
  { name: 'Cứu hộ khóa xe', slug: 'cuu-ho-khoa-xe' },
];

const vehicleSeeds = [
  { plate_number: '51K-12345', vehicle_type: 'Xe kéo ô tô', status: 'available' as const },
  { plate_number: '51C-67890', vehicle_type: 'Xe tải cẩu', status: 'available' as const },
  { plate_number: '59A-11223', vehicle_type: 'Xe máy cứu hộ', status: 'available' as const },
  { plate_number: '60B-44556', vehicle_type: 'Xe bán tải', status: 'unavailable' as const },
];

const serviceSeeds = [
  {
    name: 'Sửa chữa động cơ lưu động',
    categorySlug: 'sua-chua-dong-co-luu-dong',
    price: 150000,
    description: 'Hỗ trợ kiểm tra nhanh và khắc phục các sự cố động cơ tại chỗ.',
  },
  {
    name: 'Tiếp nhiên liệu',
    categorySlug: 'tiep-nhien-lieu',
    price: 100000,
    description: 'Tiếp nhiên liệu tận nơi trong khu vực hỗ trợ.',
  },
  {
    name: 'Vá vỏ / Vá lốp xe',
    categorySlug: 'va-vo-va-lop-xe',
    price: 80000,
    description: 'Vá lốp lưu động, thay lốp dự phòng và kiểm tra áp suất.',
  },
  {
    name: 'Cẩu kéo xe ô tô',
    categorySlug: 'cau-keo-xe-o-to',
    price: 200000,
    description: 'Cứu hộ hiện trường, kéo xe và hỗ trợ an toàn ban đầu.',
  },
  {
    name: 'Kích bình / Sạc ắc quy',
    categorySlug: 'kich-binh-sac-ac-quy',
    price: 120000,
    description: 'Kích bình ắc quy, kiểm tra dòng sạc và hệ thống điện của xe.',
  },
  {
    name: 'Cứu hộ khóa xe',
    categorySlug: 'cuu-ho-khoa-xe',
    price: 150000,
    description: 'Mở cửa xe khi quên chìa khóa hoặc gặp sự cố với khóa xe.',
  },
];

async function upsertOne<T>(model: any, filter: Record<string, unknown>, update: Record<string, unknown>): Promise<T> {
  return model.findOneAndUpdate(filter, update, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
  });
}

async function main() {
  await connectDB();

  // Clear existing services and categories to prevent legacy seed data from persisting
  console.log('Cleaning up existing service categories and services...');
  await Service.deleteMany({});
  await ServiceCategory.deleteMany({});

  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  const company = await upsertOne<any>(
    Company,
    { email: companySeed.email },
    {
      ...companySeed,
      password_hash: hashedPassword,
    }
  );

  await upsertOne<any>(
    User,
    { email: customerSeed.email },
    {
      ...customerSeed,
      password_hash: hashedPassword,
      status: 'active',
    }
  );

  await upsertOne<any>(
    Admin,
    { email: adminSeed.email },
    {
      ...adminSeed,
      password_hash: hashedPassword,
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

  // Delete all existing RescueRequests to start clean
  await RescueRequest.deleteMany({});

  console.log('Seed completed successfully');
  console.log(`Company login: ${companySeed.email} / ${DEFAULT_PASSWORD}`);
  console.log(`Customer login: ${customerSeed.email} / ${DEFAULT_PASSWORD}`);
  console.log(`Admin login: ${adminSeed.email} / ${DEFAULT_PASSWORD}`);
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
