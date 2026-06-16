# Road Rescue System - Hệ Thống Cứu Hộ Xe Cộ 24/7

Nền tảng số kết nối người tham gia giao thông gặp sự cố với các đơn vị cứu hộ chuyên nghiệp. Hệ thống cung cấp dịch vụ tìm kiếm cứu hộ qua định vị GPS, theo dõi thời gian thực, quản lý dịch vụ và hệ thống đánh giá chất lượng.

**Phiên bản hiện tại:** v2.1.0

## 📋 Tài Liệu Dự Án

- [Cấu trúc hệ thống & API (structure.md)](./structure.md)
- [Quy chuẩn Commit (COMMIT_CONVENTION.md)](./COMMIT_CONVENTION.md)
- [Nhật ký thay đổi (CHANGELOG.md)](./CHANGELOG.md)

---

## 🚀 Hướng Dẫn Cài Đặt Nhanh

### Yêu cầu hệ thống

- **Node.js**: v18 trở lên
- **Database**: MongoDB (Local hoặc MongoDB Atlas)
- **Package Manager**: npm

### 1️⃣ Thiết lập biến môi trường

Tạo file `.env` từ file mẫu tại thư mục gốc:

```bash
cp .env.example .env
```

_(Lưu ý: Thiết lập chuỗi kết nối MongoDB `MONGODB_URL` và `JWT_SECRET` bên trong file `.env` này)._

Làm tương tự cho cả `backend` và `frontend` nếu cần cấu hình riêng.

### 2️⃣ Cài đặt thư viện

Bạn cần cài đặt thư viện ở thư mục gốc (để dùng lệnh chạy đồng thời), sau đó cài đặt ở từng project:

```bash
# Cài đặt ở thư mục gốc
npm install

# Cài đặt backend
cd backend && npm install

# Cài đặt frontend
cd ../frontend && npm install
cd ..
```

### 3️⃣ Chạy dự án (Development Mode)

Chạy lệnh sau ở thư mục gốc:

```bash
npm run dev
```

- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000/api](http://localhost:3000/api)

---

## 📦 Công Nghệ Sử Dụng (Tech Stack)

| Lớp                    | Công Nghệ Chính                                                                              |
| :--------------------- | :------------------------------------------------------------------------------------------- |
| **Frontend**           | React, TypeScript, Vite, Material-UI (MUI), React Router, Socket.IO Client, Leaflet (Bản đồ) |
| **Backend**            | Node.js, Express, TypeScript, MongoDB & Mongoose, Socket.IO, Bull Queue                      |
| **Bảo mật & Trợ giúp** | JWT (JSON Web Token), bcryptjs, Joi / Zod (Validation), Multer (Upload)                      |

---

## 📚 Tính Năng Cốt Lõi

### 👤 Khách Hàng (Người dùng cá nhân)

- Đăng nhập/Đăng ký tài khoản người dùng.
- Tìm kiếm đơn vị cứu hộ gần nhất qua **tọa độ GPS**.
- Gửi yêu cầu cứu hộ, chat trực tiếp với đơn vị tiếp nhận (hỗ trợ gửi ảnh sự cố).
- Theo dõi tiến trình cứu hộ (đang chờ, đang di chuyển, đã đến nơi).
- Đánh giá chất lượng dịch vụ khi hoàn thành.
- Tham gia diễn đàn cộng đồng, bình luận, tương tác.

### 🚗 Đơn Vị Cứu Hộ (Công ty)

- Đăng ký hồ sơ công ty cứu hộ (cung cấp hình ảnh giấy phép kinh doanh).
- Quản lý danh sách phương tiện cứu hộ (xe cẩu, xe kéo).
- Cấu hình các dịch vụ cung cấp và định giá.
- Nhận thông báo yêu cầu cứu hộ và quyết định tiếp nhận.
- Cập nhật định vị GPS của xe cứu hộ để khách hàng theo dõi trực tiếp.
- Phản hồi các đánh giá từ khách hàng.

### 👨‍💼 Quản Trị Viên (Admin)

- Phê duyệt / Từ chối / Yêu cầu bổ sung hồ sơ đăng ký của công ty cứu hộ.
- Quản lý người dùng và công ty (khoá / mở khoá tài khoản khi vi phạm).
- Kiểm duyệt bài đăng trên diễn đàn cộng đồng, kiểm duyệt đánh giá dịch vụ.
- Xem báo cáo, thống kê và theo dõi nhật ký hoạt động của toàn hệ thống.

---

## 🤝 Quy Trình Đóng Góp (Collaboration)

1. **Tạo Nhánh (Branching)**: Checkout một nhánh mới từ nhánh `main` (Ví dụ: `feature/your-feature-name`).
2. **Commit**: Mọi thông điệp commit phải tuân thủ chặt chẽ theo tài liệu [Quy chuẩn Commit](./COMMIT_CONVENTION.md).
3. **Kiểm tra lỗi (Linting/Type-Check)**: Đảm bảo code sạch bằng lệnh kiểm tra trước khi push mã nguồn.
4. **Pull Request**: Tạo PR và chờ Review. Mọi cập nhật sẽ tự động ghi nhận vào [CHANGELOG.md](./CHANGELOG.md) qua quy trình `release-please`.

## 🌐 Link Deploy

https://cuuho247.vercel.app
