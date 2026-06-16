import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../shared/config/db';
import * as Models from '../shared/models';
import { getModelsToClean } from './db-utils';

const DEFAULT_PASSWORD = 'Password123!';
const SALT_ROUNDS = 10;

const CUSTOMER_NAMES = [
  { full_name: 'Nguyễn Minh An', email: 'an.nguyen@cuuho247.test', phone: '0981234567' },
  { full_name: 'Lê Thị Mai Phương', email: 'phuong.le@cuuho247.test', phone: '0972345678' },
  { full_name: 'Trần Hoàng Bách', email: 'bach.tran@cuuho247.test', phone: '0963456789' },
  { full_name: 'Phạm Quốc Anh', email: 'anh.pham@cuuho247.test', phone: '0904567890' },
  { full_name: 'Vũ Hoàng Long', email: 'long.vu@cuuho247.test', phone: '0915678901' },
  { full_name: 'Đỗ Thanh Vy', email: 'vy.do@cuuho247.test', phone: '0926789012' },
  { full_name: 'Bùi Anh Tuấn', email: 'tuan.bui@cuuho247.test', phone: '0937890123' },
  { full_name: 'Hoàng Gia Huy', email: 'huy.hoang@cuuho247.test', phone: '0948901234' },
  { full_name: 'Ngô Thu Trang', email: 'trang.ngo@cuuho247.test', phone: '0959012345' },
  { full_name: 'Phan Đăng Khoa', email: 'khoa.phan@cuuho247.test', phone: '0987654321' },
  { full_name: 'Trần Cẩm Ly', email: 'ly.tran@cuuho247.test', phone: '0812345678' },
  { full_name: 'Nguyễn Quang Hải', email: 'hai.nguyen@cuuho247.test', phone: '0823456789' },
  { full_name: 'Lê Công Vinh', email: 'vinh.le@cuuho247.test', phone: '0834567890' },
  { full_name: 'Phạm Đức Huy', email: 'huy.pham@cuuho247.test', phone: '0845678901' },
  { full_name: 'Đoàn Văn Hậu', email: 'hau.doan@cuuho247.test', phone: '0856789012' },
  { full_name: 'Bùi Tiến Dũng', email: 'dung.bui@cuuho247.test', phone: '0867890123' },
  { full_name: 'Vũ Văn Thanh', email: 'thanh.vu@cuuho247.test', phone: '0878901234' },
  { full_name: 'Nguyễn Công Phượng', email: 'phuong.nguyen@cuuho247.test', phone: '0889012345' },
  { full_name: 'Nguyễn Văn Toàn', email: 'toan.nguyen@cuuho247.test', phone: '0890123456' },
  { full_name: 'Hà Đức Chinh', email: 'chinh.ha@cuuho247.test', phone: '0701234567' },
  { full_name: 'Đặng Văn Lâm', email: 'lam.dang@cuuho247.test', phone: '0712345678' },
  { full_name: 'Quế Ngọc Hải', email: 'hai.que@cuuho247.test', phone: '0723456789' },
  { full_name: 'Đỗ Hùng Dũng', email: 'dung.do@cuuho247.test', phone: '0734567890' },
  { full_name: 'Nguyễn Tiến Linh', email: 'linh.nguyen@cuuho247.test', phone: '0745678901' },
  { full_name: 'Lương Xuân Trường', email: 'truong.luong@cuuho247.test', phone: '0756789012' },
];

// Hanoi Companies (with specific coordinates and service areas)
const COMPANIES_DATA = [
  {
    company_name: 'Cứu Hộ Đông Đô',
    email: 'dongdo@cuuho247.test',
    phone: '0243123456',
    director_name: 'Trần Tiến Dũng',
    address: { province: 'TP. Hà Nội', district: 'Quận Đống Đa', ward: 'Phường Nam Đồng', detail: '88 Xã Đàn' },
    location: { type: 'Point' as const, coordinates: [105.825, 21.018] },
    license_file_url: 'https://example.com/licenses/dongdo.jpg',
    status: 'active' as const,
    is_verified: true,
    rating_avg: 4.7,
    rating_count: 0, // Calculated dynamically
  },
  {
    company_name: 'Cứu Hộ Hà Nội 247',
    email: 'hanoi247@cuuho247.test',
    phone: '0243999888',
    director_name: 'Nguyễn Văn Hùng',
    address: { province: 'TP. Hà Nội', district: 'Quận Cầu Giấy', ward: 'Phường Dịch Vọng', detail: '12 Cầu Giấy' },
    location: { type: 'Point' as const, coordinates: [105.798, 21.036] },
    license_file_url: 'https://example.com/licenses/hanoi247.jpg',
    status: 'active' as const,
    is_verified: true,
    rating_avg: 4.9,
    rating_count: 0,
  },
  {
    company_name: 'Cứu Hộ Ô Tô Thăng Long',
    email: 'thanglong@cuuho247.test',
    phone: '0243777666',
    director_name: 'Phạm Thanh Nam',
    address: { province: 'TP. Hà Nội', district: 'Quận Hoàn Kiếm', ward: 'Phường Hàng Bạc', detail: '45 Hàng Bạc' },
    location: { type: 'Point' as const, coordinates: [105.852, 21.028] },
    license_file_url: 'https://example.com/licenses/thanglong.jpg',
    status: 'active' as const,
    is_verified: true,
    rating_avg: 4.5,
    rating_count: 0,
  },
  {
    company_name: 'Sửa Xe Lưu Động Hà Thành',
    email: 'hathanh@cuuho247.test',
    phone: '0243555444',
    director_name: 'Lê Văn Phước',
    address: {
      province: 'TP. Hà Nội',
      district: 'Quận Hai Bà Trưng',
      ward: 'Phường Bách Khoa',
      detail: '10 Tạ Quang Bửu',
    },
    location: { type: 'Point' as const, coordinates: [105.851, 21.008] },
    license_file_url: 'https://example.com/licenses/hathanh.jpg',
    status: 'active' as const,
    is_verified: true,
    rating_avg: 4.6,
    rating_count: 0,
  },
  {
    company_name: 'Cứu Hộ Ô Tô Tây Hồ',
    email: 'tayho@cuuho247.test',
    phone: '0243333222',
    director_name: 'Hoàng Quốc Việt',
    address: { province: 'TP. Hà Nội', district: 'Quận Tây Hồ', ward: 'Phường Bưởi', detail: '256 Lạc Long Quân' },
    location: { type: 'Point' as const, coordinates: [105.819, 21.066] },
    license_file_url: 'https://example.com/licenses/tayho.jpg',
    status: 'active' as const,
    is_verified: true,
    rating_avg: 4.2,
    rating_count: 0,
  },
  {
    company_name: 'Tổng Đội Cứu Hộ Thủ Đô',
    email: 'thudo@cuuho247.test',
    phone: '0243888111',
    director_name: 'Vũ Thế Anh',
    address: {
      province: 'TP. Hà Nội',
      district: 'Quận Thanh Xuân',
      ward: 'Phường Nhân Chính',
      detail: '102 Lê Văn Lương',
    },
    location: { type: 'Point' as const, coordinates: [105.808, 20.998] },
    license_file_url: 'https://example.com/licenses/thudo.jpg',
    status: 'pending_verification' as const, // For admin logs testing
    is_verified: false,
    rating_avg: 0,
    rating_count: 0,
  },
  {
    company_name: 'Cứu Hộ Ô Tô Nam Từ Liêm',
    email: 'namtuliem@cuuho247.test',
    phone: '0243222333',
    director_name: 'Lê Nam Sơn',
    address: { province: 'TP. Hà Nội', district: 'Quận Nam Từ Liêm', ward: 'Phường Mỹ Đình 1', detail: '50 Phạm Hùng' },
    location: { type: 'Point' as const, coordinates: [105.779, 21.025] },
    license_file_url: 'https://example.com/licenses/namtuliem.jpg',
    status: 'active' as const,
    is_verified: true,
    rating_avg: 4.8,
    rating_count: 0,
  },
  {
    company_name: 'Cứu Hộ Long Biên',
    email: 'longbien@cuuho247.test',
    phone: '0243666555',
    director_name: 'Phạm Đức Bảo',
    address: { province: 'TP. Hà Nội', district: 'Quận Long Biên', ward: 'Phường Bồ Đề', detail: '200 Nguyễn Văn Cừ' },
    location: { type: 'Point' as const, coordinates: [105.877, 21.045] },
    license_file_url: 'https://example.com/licenses/longbien.jpg',
    status: 'active' as const,
    is_verified: true,
    rating_avg: 4.6,
    rating_count: 0,
  },
  {
    company_name: 'Cứu Hộ Ô Tô Thanh Xuân',
    email: 'thanhxuan@cuuho247.test',
    phone: '0243111222',
    director_name: 'Nguyễn Thanh Bình',
    address: {
      province: 'TP. Hà Nội',
      district: 'Quận Thanh Xuân',
      ward: 'Phường Khương Trung',
      detail: '50 Khương Trung',
    },
    location: { type: 'Point' as const, coordinates: [105.818, 20.992] },
    license_file_url: 'https://example.com/licenses/thanhxuan.jpg',
    status: 'pending_verification' as const,
    is_verified: false,
    rating_avg: 0,
    rating_count: 0,
  },
  {
    company_name: 'Cứu Hộ Hoàng Mai',
    email: 'hoangmai@cuuho247.test',
    phone: '0243444555',
    director_name: 'Lê Hoàng',
    address: { province: 'TP. Hà Nội', district: 'Quận Hoàng Mai', ward: 'Phường Giáp Bát', detail: '100 Giải Phóng' },
    location: { type: 'Point' as const, coordinates: [105.842, 20.985] },
    license_file_url: 'https://example.com/licenses/hoangmai.jpg',
    status: 'pending_verification' as const,
    is_verified: false,
    rating_avg: 0,
    rating_count: 0,
  },
];

// Service Category Seeds matching incidentMapping.ts
const CATEGORY_SEEDS = [
  { name: 'Vá vỏ và vá lốp xe', slug: 'va-vo-va-lop-xe' },
  { name: 'Kích bình, sạc ắc quy', slug: 'kich-binh-sac-ac-quy' },
  { name: 'Tiếp nhiên liệu', slug: 'tiep-nhien-lieu' },
  { name: 'Sửa chữa động cơ lưu động', slug: 'sua-chua-dong-co-luu-dong' },
  { name: 'Cẩu kéo xe ô tô', slug: 'cau-keo-xe-o-to' },
  { name: 'Cứu hộ khóa xe', slug: 'cuu-ho-khoa-xe' },
];

const VEHICLE_TYPES = ['Xe kéo ô tô', 'Xe tải cẩu cứu hộ', 'Xe chở ô tô chuyên dụng', 'Xe máy kỹ thuật lưu động'];

const CHAT_TEMPLATES = [
  {
    messages: [
      {
        sender_type: 'user' as const,
        content: 'Tôi bị thủng lốp xe gần Lotte Liễu Giai, bên mình qua xử lý giúp tôi.',
      },
      {
        sender_type: 'company' as const,
        content: 'Dạ vâng, bên em nhận được yêu cầu rồi ạ. Kỹ thuật viên đang chuẩn bị di chuyển.',
      },
      {
        sender_type: 'company' as const,
        content: 'Xe cứu hộ biển số 29A-123.45 đang đi qua, khoảng 10 phút nữa tới nơi ạ.',
      },
      { sender_type: 'user' as const, content: 'Ok em, anh đang bật đèn cảnh báo sự cố đứng bên đường.' },
    ],
  },
  {
    messages: [
      { sender_type: 'user' as const, content: 'Xe của tôi đề không nổ, nghi là hết bình ắc quy.' },
      {
        sender_type: 'company' as const,
        content: 'Dạ, bên em có dịch vụ kích bình ắc quy lưu động. Phí kích bình là 200.000 VNĐ anh nhé.',
      },
      { sender_type: 'user' as const, content: 'Nhất trí, chuyển thợ qua kích bình giúp anh.' },
      { sender_type: 'company' as const, content: 'Dạ thợ của em tên Nam đang trên đường tới ạ.' },
    ],
  },
  {
    messages: [
      { sender_type: 'user' as const, content: 'Tôi bị kẹt khóa xe ô tô không mở được cửa.' },
      {
        sender_type: 'company' as const,
        content: 'Chào anh, thợ khóa của bên em đang di chuyển tới vị trí của anh nhé, tầm 15 phút ạ.',
      },
    ],
  },
];

const REVIEW_CONTENTS = [
  { rating: 5, content: 'Dịch vụ cứu hộ cực kỳ nhanh chóng và chuyên nghiệp! Rất hài lòng.' },
  { rating: 5, content: 'Giá cả hợp lý, thợ sửa nhiệt tình chu đáo, khắc phục thủng lốp chỉ trong 10 phút.' },
  { rating: 4, content: 'Nhân viên hỗ trợ tốt, xe đến hơi muộn một chút do tắc đường nhưng thái độ thân thiện.' },
  { rating: 5, content: 'Kích bình ắc quy nhanh gọn, giá cả đúng như báo giá ban đầu không vẽ thêm lỗi.' },
  { rating: 4, content: 'Chất lượng cứu hộ ổn, kéo xe về gara an toàn.' },
  { rating: 3, content: 'Thời gian tiếp cận hơi lâu, tuy nhiên thợ kỹ thuật có tay nghề tốt.' },
  { rating: 5, content: 'Tuyệt vời, mình gọi phát là có mặt ngay lập tức, sửa chữa tận tình!' },
  { rating: 4, content: 'Thợ làm cẩn thận, có giải thích rõ lỗi của xe.' },
  { rating: 5, content: 'Rất ưng ý với thái độ phục vụ của các bạn, sẽ ủng hộ dài dài nếu có sự cố.' },
  { rating: 2, content: 'Chờ hơi lâu so với cam kết, giá cũng hơi cao một chút.' },
  { rating: 5, content: 'Dịch vụ uy tín chất lượng, nhân viên thân thiện. 10 điểm!' },
];

const COMMUNITY_POSTS = [
  {
    title: 'Chia sẻ kinh nghiệm tự xử lý khi xe ô tô bị xịt lốp trên đường cao tốc',
    content:
      'Khi xe bị xịt lốp trên cao tốc, việc đầu tiên là phải giữ bình tĩnh, từ từ tấp vào làn dừng khẩn cấp. Nhớ bật đèn cảnh báo nguy hiểm (hazard light) và đặt biển cảnh báo tam giác cách đuôi xe ít nhất 100m. Nếu không có lốp dự phòng hoặc dụng cụ thay thế, hãy gọi ngay dịch vụ cứu hộ lưu động chuyên nghiệp để đảm bảo an toàn.',
  },
  {
    title: 'Làm thế nào để bảo quản bình ắc quy ô tô tốt nhất trong mùa hè?',
    content:
      'Thời tiết nắng nóng gay gắt của mùa hè ảnh hưởng rất lớn đến tuổi thọ ắc quy. Mọi người nên lưu ý: Tránh đỗ xe trực tiếp dưới ánh nắng mặt trời quá lâu, thường xuyên kiểm tra mức dung dịch điện phân (đối với ắc quy nước), làm sạch các điện cực để đảm bảo tiếp xúc tốt và không bật thiết bị điện khi không nổ máy.',
  },
  {
    title: 'Cảnh báo tình trạng đinh tặc xuất hiện khu vực cầu Vĩnh Tuy',
    content:
      'Sáng nay mình đi qua đoạn dốc lên cầu Vĩnh Tuy hướng từ Minh Khai sang Long Biên thấy có khá nhiều mảnh sắt vụn và đinh vít. Nhiều xe máy và 1 chiếc ô tô con đã phải tấp vào lề vì dính đinh. Anh em đi qua khu vực này chú ý quan sát và đi chậm nhé!',
  },
  {
    title: 'Cần lưu ý gì khi gọi xe cứu hộ kéo về xưởng?',
    content:
      'Mọi người cho mình hỏi, khi gọi xe kéo cứu hộ về xưởng thì có cần yêu cầu họ ghi rõ biên bản bàn giao xe không? Mình sợ trong quá trình kéo xe bị trầy xước thêm mà không có bằng chứng gì để khiếu nại.',
  },
  {
    title: 'Cách xử lý tạm thời khi xe ô tô bị chết máy giữa đường',
    content:
      'Khi xe đang đi tự nhiên chết máy, bạn hãy thử đề lại khoảng 2-3 lần (đừng đề liên tục quá lâu kẻo hỏng củ đề). Nếu không được, nhanh chóng bật đèn khẩn cấp, nhờ người đẩy gọn vào lề rồi mới gọi cứu hộ để tránh ùn tắc giao thông.',
  },
];

async function main() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Clearing all existing database collections...');
  const modelsToClean = getModelsToClean();

  for (const { name, model } of modelsToClean) {
    if (model && typeof model.deleteMany === 'function') {
      await model.deleteMany({});
    }
  }
  console.log('All collections cleared successfully.');

  // Pre-hash password for efficiency
  console.log('Generating password hashes...');
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

  // 1. Seed Service Categories
  console.log('Seeding Service Categories...');
  const categories: any[] = [];
  for (const cat of CATEGORY_SEEDS) {
    const createdCat = await Models.ServiceCategory.create({
      name: cat.name,
      slug: cat.slug,
      is_active: true,
    });
    categories.push(createdCat);
  }
  console.log(`Seeded ${categories.length} Service Categories.`);

  // 2. Seed Admin
  console.log('Seeding Admin account...');
  const admin = await Models.Admin.create({
    email: 'admin@cuuho247.test',
    password_hash: hashedPassword,
    full_name: 'Quản Trị Viên Hệ Thống',
  });
  console.log(`Seeded Admin: ${admin.email}`);

  const now = new Date();

  // Helper to generate dates between June 1, 2026 and July 31, 2026
  const startBoundary = new Date('2026-06-01T00:00:00Z').getTime();
  const endBoundary = new Date('2026-07-31T23:59:59Z').getTime();
  const getRandomDate = () => new Date(startBoundary + Math.random() * (endBoundary - startBoundary));

  // 3. Seed Users (Customers)
  console.log('Seeding Customer accounts...');
  const users: any[] = [];
  for (const cust of CUSTOMER_NAMES) {
    const createdUser = await Models.User.create({
      email: cust.email,
      password_hash: hashedPassword,
      full_name: cust.full_name,
      phone: cust.phone,
      status: 'active',
      avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cust.full_name)}`,
      createdAt: getRandomDate(),
    });
    users.push(createdUser);
  }
  console.log(`Seeded ${users.length} Customers.`);

  // 4. Seed Companies
  console.log('Seeding Companies...');
  const companies: any[] = [];
  for (const comp of COMPANIES_DATA) {
    const createdCompany = await Models.Company.create({
      ...comp,
      password_hash: hashedPassword,
      createdAt: getRandomDate(),
    });
    companies.push(createdCompany);
  }
  console.log(`Seeded ${companies.length} Companies in Hanoi.`);

  // 5. Seed Vehicles and Services for Companies
  console.log('Seeding Vehicles and Services...');
  const vehiclesMap: Record<string, any[]> = {};
  const servicesMap: Record<string, any[]> = {};

  for (const comp of companies) {
    vehiclesMap[comp._id.toString()] = [];
    servicesMap[comp._id.toString()] = [];

    // Seed 3-4 Vehicles per Company
    const vehicleCount = Math.floor(Math.random() * 2) + 3; // 3 to 4 vehicles
    for (let i = 0; i < vehicleCount; i++) {
      const plateNumber = `29${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(10000 + Math.random() * 90000)}`;
      const vehicle = await Models.Vehicle.create({
        company_id: comp._id,
        plate_number: plateNumber,
        vehicle_type: VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)],
        status: i === 0 ? ('unavailable' as const) : ('available' as const), // Make one unavailable
      });
      vehiclesMap[comp._id.toString()].push(vehicle);
    }

    // Seed Services mapping to ServiceCategories supported
    // Only active companies offer services
    if (comp.status === 'active') {
      // Pick random categories (3 to 5 categories)
      const shuffledCats = [...categories].sort(() => 0.5 - Math.random());
      const selectedCats = shuffledCats.slice(0, Math.floor(Math.random() * 3) + 3);

      for (const cat of selectedCats) {
        let price = 150000;
        let description = '';

        if (cat.slug === 'va-vo-va-lop-xe') {
          price = 100000 + Math.floor(Math.random() * 6) * 10000; // 100k - 150k
          description = 'Vá lốp ô tô lưu động, hỗ trợ lốp dự phòng tận nơi.';
        } else if (cat.slug === 'kich-binh-sac-ac-quy') {
          price = 150000 + Math.floor(Math.random() * 6) * 10000; // 150k - 200k
          description = 'Kích nổ bình ắc quy xe hơi, sạc bình chuyên dụng.';
        } else if (cat.slug === 'tiep-nhien-lieu') {
          price = 80000 + Math.floor(Math.random() * 5) * 10000; // 80k - 120k
          description = 'Tiếp xăng/dầu khẩn cấp tận nơi khu vực Hà Nội.';
        } else if (cat.slug === 'sua-chua-dong-co-luu-dong') {
          price = 250000 + Math.floor(Math.random() * 6) * 50000; // 250k - 500k
          description = 'Kiểm tra, khắc phục lỗi kỹ thuật, lỗi điện hoặc động cơ không nổ.';
        } else if (cat.slug === 'cau-keo-xe-o-to') {
          price = 600000 + Math.floor(Math.random() * 10) * 100000; // 600k - 1.5M
          description = 'Cẩu kéo xe gặp nạn, xe ngập nước hoặc sa lầy về gara yêu cầu.';
        } else if (cat.slug === 'cuu-ho-khoa-xe') {
          price = 150000 + Math.floor(Math.random() * 4) * 50000; // 150k - 300k
          description = 'Xử lý kẹt khóa cửa ô tô, để quên chìa khóa trong xe.';
        }

        const service = await Models.Service.create({
          company_id: comp._id,
          category_id: cat._id,
          name: cat.name,
          price,
          description,
          is_active: true,
        });
        servicesMap[comp._id.toString()].push(service);
      }
    }
  }
  console.log('Seeded Vehicles and Services for all companies.');

  // 6. Seed Rescue Requests, status history, payments, and reviews
  console.log('Seeding Rescue Requests, Chat Messages, and Reviews...');
  const activeCompanies = companies.filter((c) => c.status === 'active');

  // Create 500 requests distributed over June and July 2026
  const requests: any[] = [];
  const reviewsToCreate: any[] = [];

  for (let i = 0; i < 500; i++) {
    // Pick random user and active company
    const user = users[Math.floor(Math.random() * users.length)];
    const comp = activeCompanies[Math.floor(Math.random() * activeCompanies.length)];

    // Pick random service categories offered by this company
    const compServices = servicesMap[comp._id.toString()] || [];
    if (compServices.length === 0) continue;
    const numServices = Math.floor(Math.random() * 2) + 1; // 1 or 2 service types
    const shuffledServices = [...compServices].sort(() => 0.5 - Math.random());
    const selectedServices = shuffledServices.slice(0, numServices);
    const serviceTypeIds = selectedServices.map((s) => s.category_id);

    // Calculate total service amount
    const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);

    // Determine request date within June and July
    const reqDate = getRandomDate();

    // Status distribution: ~70% Completed, ~10% Cancelled, ~10% Rejected, ~5% In Progress, ~5% Pending
    let status: string = 'completed';
    if (i >= 350 && i < 400) {
      status = 'cancelled';
    } else if (i >= 400 && i < 450) {
      status = 'rejected';
    } else if (i >= 450 && i < 475) {
      status = 'in_progress';
    } else if (i >= 475) {
      status = 'pending';
    }

    // Coordinates close to the company (within ~2km)
    const latDelta = (Math.random() - 0.5) * 0.03;
    const lngDelta = (Math.random() - 0.5) * 0.03;
    const requestLocation = {
      type: 'Point' as const,
      coordinates: [comp.location.coordinates[0] + lngDelta, comp.location.coordinates[1] + latDelta],
    };

    // Timeline timestamps
    let accepted_at: Date | undefined;
    let started_at: Date | undefined;
    let arrived_at: Date | undefined;
    let completed_at: Date | undefined;
    let cancelled_at: Date | undefined;
    let payment: any = undefined;
    let cancellation: any = undefined;
    let vehicleInfo: any = undefined;

    const status_history: any[] = [
      { status: 'pending', changed_by: 'user', changed_at: reqDate, note: 'Khách hàng tạo yêu cầu cứu hộ khẩn cấp.' },
    ];

    if (status !== 'pending' && status !== 'rejected') {
      accepted_at = new Date(reqDate.getTime() + (Math.floor(Math.random() * 5) + 1) * 60 * 1000); // 1-5 mins later
      status_history.push({
        status: 'accepted' as const,
        changed_by: 'company' as const,
        changed_at: accepted_at,
        note: 'Đối tác đã xác nhận cứu hộ.',
      });

      // Assign a vehicle
      const compVehicles = vehiclesMap[comp._id.toString()] || [];
      const assignedVeh = compVehicles[Math.floor(Math.random() * compVehicles.length)];
      if (assignedVeh) {
        vehicleInfo = {
          vehicle_id: assignedVeh._id,
          plate_number: assignedVeh.plate_number,
        };
      }

      if (status !== 'accepted') {
        started_at = new Date(accepted_at.getTime() + (Math.floor(Math.random() * 5) + 2) * 60 * 1000); // 2-7 mins later
        status_history.push({
          status: 'in_progress' as const,
          changed_by: 'company' as const,
          changed_at: started_at,
          note: 'Nhân viên cứu hộ đang di chuyển đến hiện trường.',
        });

        if (status === 'completed' || status === 'cancelled') {
          arrived_at = new Date(started_at.getTime() + (Math.floor(Math.random() * 20) + 10) * 60 * 1000); // 10-30 mins later
          status_history.push({
            status: 'arrived' as const,
            changed_by: 'company' as const,
            changed_at: arrived_at,
            note: 'Đã tiếp cận hiện trường sự cố.',
          });

          if (status === 'completed') {
            completed_at = new Date(arrived_at.getTime() + (Math.floor(Math.random() * 30) + 15) * 60 * 1000); // 15-45 mins later
            status_history.push({
              status: 'completed' as const,
              changed_by: 'company' as const,
              changed_at: completed_at,
              note: 'Sự cố đã được khắc phục hoàn tất.',
            });

            // Set payment info
            payment = {
              amount: totalAmount,
              method: ['cash', 'bank_transfer', 'e_wallet'][Math.floor(Math.random() * 3)] as any,
              paid_at: completed_at,
            };
          } else if (status === 'cancelled') {
            cancelled_at = new Date(arrived_at.getTime() + 5 * 60 * 1000);
            cancellation = {
              cancelled_by: 'user' as const,
              reason: 'Đã tìm được người quen hỗ trợ sửa giúp.',
            };
            status_history.push({
              status: 'cancelled' as const,
              changed_by: 'user' as const,
              changed_at: cancelled_at,
              note: 'Khách hàng hủy yêu cầu cứu hộ.',
            });
          }
        }
      }
    } else if (status === 'rejected') {
      const rejectTime = new Date(reqDate.getTime() + 2 * 60 * 1000);
      status_history.push({
        status: 'rejected' as const,
        changed_by: 'company' as const,
        changed_at: rejectTime,
        note: 'Đối tác từ chối nhận cứu hộ do quá xa hoặc không đủ thợ.',
      });
    }

    const categoryId = selectedServices[0].category_id;
    const categoryDoc = categories.find((c) => c._id.toString() === categoryId.toString());
    const catSlug = categoryDoc ? categoryDoc.slug : '';

    const catToIncidentMap: Record<string, string> = {
      'va-vo-va-lop-xe': 'su-co-lop-xe',
      'kich-binh-sac-ac-quy': 'het-binh-ac-quy',
      'tiep-nhien-lieu': 'het-nhien-lieu',
      'sua-chua-dong-co-luu-dong': 'xe-chet-may',
      'cau-keo-xe-o-to': 'tai-nan-giao-thong',
      'cuu-ho-khoa-xe': 'su-co-khoa-xe',
    };
    const incidentType = catToIncidentMap[catSlug] || 'khac';

    const description = `Yêu cầu cứu hộ xe gặp sự cố liên quan đến ${selectedServices.map((s) => s.name.toLowerCase()).join(' và ')}.`;

    const request = await Models.RescueRequest.create({
      user_id: user._id,
      company: {
        company_id: comp._id,
        company_name: comp.company_name,
      },
      vehicle: vehicleInfo,
      description,
      location: requestLocation,
      service_types: serviceTypeIds,
      incident_type: incidentType,
      address: {
        province: comp.address.province,
        district: comp.address.district,
        ward: comp.address.ward,
        detail: 'Đoạn đường gặp sự cố giao thông',
      },
      status,
      status_history,
      accepted_at,
      started_at,
      arrived_at,
      completed_at,
      cancelled_at,
      cancellation,
      payment,
      created_at: reqDate,
      updated_at: reqDate,
    });
    requests.push(request);

    // 6.1 Seed Chat Messages for Active or Completed requests
    if (status === 'completed' || status === 'in_progress') {
      const chatTemplate = CHAT_TEMPLATES[Math.floor(Math.random() * CHAT_TEMPLATES.length)];
      let msgTime = reqDate.getTime() + 30 * 1000;

      for (const msg of chatTemplate.messages) {
        msgTime += (Math.floor(Math.random() * 2) + 1) * 60 * 1000;
        await Models.Message.create({
          rescue_request_id: request._id,
          sender_type: msg.sender_type,
          sender_id: msg.sender_type === 'user' ? user._id : comp._id,
          content: msg.content,
          content_type: 'text',
          is_read: true,
          created_at: new Date(msgTime),
        });
      }
    }

    // 6.2 Seed Reviews & Replies for completed requests (approx. 75% of them)
    if (status === 'completed' && Math.random() < 0.75) {
      const reviewTemplate = REVIEW_CONTENTS[Math.floor(Math.random() * REVIEW_CONTENTS.length)];
      const clamp = (val: number) => Math.max(1, Math.min(5, val));
      const detailed_ratings = {
        response_time: clamp(reviewTemplate.rating + (Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? 1 : -1)),
        service_quality: clamp(reviewTemplate.rating + (Math.random() > 0.6 ? 0 : Math.random() > 0.5 ? 1 : -1)),
        staff_attitude: reviewTemplate.rating,
        pricing: clamp(reviewTemplate.rating + (Math.random() > 0.5 ? 0 : Math.random() > 0.5 ? -1 : 1)),
      };

      const reviewDate = new Date(completed_at!.getTime() + (Math.floor(Math.random() * 60) + 10) * 60 * 1000); // 10-70 mins later

      let reply: any = undefined;
      // 50% chance company replies to the review
      if (Math.random() > 0.5) {
        reply = {
          content: 'Dạ, rất cảm ơn quý khách đã tin tưởng và sử dụng dịch vụ của cứu hộ bên em!',
          replied_at: new Date(reviewDate.getTime() + (Math.floor(Math.random() * 12) + 1) * 60 * 60 * 1000), // 1-12 hours later
          is_visible: true,
        };
      }

      const review = await Models.Review.create({
        rescue_request_id: request._id,
        user_id: user._id,
        company_id: comp._id,
        rating: reviewTemplate.rating,
        detailed_ratings,
        content: reviewTemplate.content,
        is_visible: true,
        reply,
        created_at: reviewDate,
        updated_at: reviewDate,
      });
      reviewsToCreate.push(review);
    }
  }
  console.log(
    `Seeded ${requests.length} Rescue Requests, along with associated messages, reviews and company replies.`
  );

  // 7. Calculate and sync Company Rating statistics based on seeded Reviews
  console.log('Recalculating ratings for active companies...');
  for (const comp of activeCompanies) {
    const compReviews = reviewsToCreate.filter((r) => r.company_id.toString() === comp._id.toString());
    const count = compReviews.length;
    const avg = count > 0 ? compReviews.reduce((sum, r) => sum + r.rating, 0) / count : 4.5;

    comp.rating_avg = Math.round(avg * 10) / 10;
    comp.rating_count = count;
    await comp.save();
    console.log(`Synced rating for ${comp.company_name}: ${comp.rating_avg}★ (${comp.rating_count} reviews)`);
  }

  // 8. Seed Community Posts, Comments, and Likes
  console.log('Seeding Community Forums (Posts, Comments, Likes)...');
  const posts: any[] = [];
  for (let i = 0; i < COMMUNITY_POSTS.length; i++) {
    const postData = COMMUNITY_POSTS[i];
    // Alternate authors between user and company
    const isUserAuthor = i % 2 === 0;
    const author = isUserAuthor ? users[i % users.length] : activeCompanies[i % activeCompanies.length];

    // Pick 1-2 random tags
    const numTags = Math.floor(Math.random() * 2) + 1;
    const postTags = [...categories]
      .sort(() => 0.5 - Math.random())
      .slice(0, numTags)
      .map((c) => c._id);

    const post = await Models.CommunityPost.create({
      user_id: author._id,
      user_type: isUserAuthor ? 'User' : 'Company',
      title: postData.title,
      content: postData.content,
      tags: postTags,
      is_visible: true,
      like_count: 0,
      comment_count: 0,
      created_at: getRandomDate(),
    });
    posts.push(post);
  }

  // Seed Comments on Posts
  console.log('Seeding Comments on posts...');
  const commentTexts = [
    'Thông tin rất hữu ích, cảm ơn bạn đã chia sẻ.',
    'Đúng vậy, lái xe an toàn luôn là ưu tiên số một.',
    'Mình cũng từng bị xịt lốp trên cao tốc, quả thực lúc đó rất hoảng sợ.',
    'Ắc quy ô tô dùng tầm 2-3 năm là nên thay định kỳ rồi các bác ạ.',
    'Cảm ơn bác thớt đã cảnh báo khu vực cầu Vĩnh Tuy, để chiều về đi đường khác.',
  ];

  for (const post of posts) {
    let commentCount = 0;
    // Add 2-3 comments per post
    const commentNum = Math.floor(Math.random() * 2) + 2;
    for (let c = 0; c < commentNum; c++) {
      const commenter = users[(c + post.title.length) % users.length];
      await Models.CommunityPostComment.create({
        post_id: post._id,
        user_id: commenter._id,
        user_type: 'User',
        content: commentTexts[Math.floor(Math.random() * commentTexts.length)],
        is_visible: true,
        created_at: new Date(post.created_at!.getTime() + (c + 1) * 30 * 60 * 1000), // 30-90 mins later
      });
      commentCount++;
    }
    post.comment_count = commentCount;
    await post.save();
  }

  // Seed Likes on Posts
  console.log('Seeding Likes on posts...');
  for (const post of posts) {
    let likeCount = 0;
    // Add 3-5 likes per post
    const likeNum = Math.floor(Math.random() * 3) + 3;
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random()).slice(0, likeNum);
    for (const liker of shuffledUsers) {
      await Models.CommunityPostLike.create({
        post_id: post._id,
        user_id: liker._id,
      });
      likeCount++;
    }
    post.like_count = likeCount;
    await post.save();
  }
  console.log(`Seeded ${posts.length} forum posts with likes and comments.`);

  // 9. Seed Admin Audit Logs (AdminLog)
  console.log('Seeding Admin Audit Logs...');
  const adminLogsData: any[] = [];
  const adminActions = [
    { action: 'verify_company', target_type: 'company' },
    { action: 'reject_company', target_type: 'company' },
    { action: 'request_more_docs', target_type: 'company' },
    { action: 'lock_user', target_type: 'user' },
    { action: 'unlock_user', target_type: 'user' },
    { action: 'remove_review', target_type: 'review' },
    { action: 'remove_post', target_type: 'community_post' },
  ];

  for (let i = 0; i < 50; i++) {
    const actionObj = adminActions[Math.floor(Math.random() * adminActions.length)];
    let target_id;
    let reason = '';
    let details: any = {};

    if (actionObj.target_type === 'company') {
      const comp = companies[Math.floor(Math.random() * companies.length)];
      target_id = comp._id;
      details = { company_name: comp.company_name };
      if (actionObj.action === 'verify_company') reason = 'Hồ sơ pháp lý hợp lệ, đầy đủ giấy phép hoạt động.';
      if (actionObj.action === 'reject_company') reason = 'Công ty cung cấp giấy tờ không đúng chuẩn hoặc hết hạn.';
      if (actionObj.action === 'request_more_docs') {
        reason = 'Ảnh chụp đăng ký kinh doanh bị mờ, không rõ thông tin.';
        details.requested_fields = ['business_license'];
      }
    } else if (actionObj.target_type === 'user') {
      const u = users[Math.floor(Math.random() * users.length)];
      target_id = u._id;
      details = { user_email: u.email };
      if (actionObj.action === 'lock_user') {
        reason = 'Khách hàng tạo nhiều yêu cầu khống liên tục làm phiền đối tác.';
        details.duration_days = 7;
      }
      if (actionObj.action === 'unlock_user') reason = 'Hết hạn khóa tài khoản, người dùng cam kết không tái phạm.';
    } else if (actionObj.target_type === 'review') {
      const rev = reviewsToCreate[Math.floor(Math.random() * reviewsToCreate.length)];
      if (rev) {
        target_id = rev._id;
        details = { reviewer_id: rev.user_id };
        reason = 'Đánh giá chứa ngôn từ không phù hợp, vi phạm tiêu chuẩn cộng đồng.';
      } else {
        continue;
      }
    } else if (actionObj.target_type === 'community_post') {
      const post = posts[Math.floor(Math.random() * posts.length)];
      target_id = post._id;
      details = { post_title: post.title };
      reason = 'Bài viết chứa nội dung quảng cáo sai sự thật hoặc spam.';
    }

    const logDate = getRandomDate();

    adminLogsData.push({
      admin_id: admin._id,
      action: actionObj.action,
      target_type: actionObj.target_type,
      target_id,
      reason,
      details,
      created_at: logDate,
    });
  }

  for (const log of adminLogsData) {
    await Models.AdminLog.create(log);
  }
  console.log(`Seeded ${adminLogsData.length} Admin Audit Logs.`);

  console.log('\n======================================================');
  console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('======================================================');
  console.log(`- Service Categories:  ${categories.length}`);
  console.log(`- Admins:              1 (admin@cuuho247.test)`);
  console.log(`- Users (Customers):   ${users.length}`);
  console.log(`- Companies (Hanoi):   ${companies.length}`);
  console.log(`- Active Requests:     500`);
  console.log(`- Reviews & Replies:   ${reviewsToCreate.length}`);
  console.log(`- Forum Posts:         ${posts.length}`);
  console.log(`- Admin Logs:          ${adminLogsData.length}`);
  console.log(`- Notification:        0 (skipped as requested)`);
  console.log('======================================================\n');

  await mongoose.disconnect();
  console.log('Database connection closed.');
  process.exit(0);
}

main().catch(async (error) => {
  console.error('Database seeding failed:', error);
  await mongoose.disconnect();
  process.exit(1);
});
